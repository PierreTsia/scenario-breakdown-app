<template>
  <v-container>
    <v-list>
      <v-list-item class="justify-center">
        <v-row class="d-inline-flex pa-4" v-click-outside="onClickOutside">
          <drag-select attribute="dragSelectAttr" @change="handleChange">
            <span
              v-for="item in words"
              :ref="`item-${item.uniqId}`"
              @click="handleClick(item)"
              :key="item.uniqId"
              :dragSelectAttr="item.uniqId"
              :style="wordStyles(item)"
              :class="
                isDragSelected(item) ? ['accent--text', 'font-weight-bold'] : ''
              "
              class="d-inline-block word  primary--text"
              >{{ item.value }}
            </span>
          </drag-select>
        </v-row>
      </v-list-item>
    </v-list>
  </v-container>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch, Emit } from "vue-property-decorator";
import { Word } from "@/dtos/Word.dto";
import DragSelect from "drag-select-vue";
import first from "lodash/first";
import last from "lodash/last";
import { Icons } from "@/components/core/icons/icons-names.enum";
import { annotateModule } from "@/store/modules/annotate";
import { Annotation } from "@/dtos/Annotation.dto";
import { Punct, PunctuationHelper } from "@/helpers/punctuation.helper";

const FLOATING_BTN = ["floatingBtn", "floatingBtn__icon", "floatingBtn__btn"];

@Component({ components: { DragSelect } })
export default class ParagraphViewer extends Vue {
  @Prop({ default: [] })
  paragraphs!: Word[][];
  dragSelectBoundaries: string[] = [];
  icons = Icons;
  punctuationHelper = new PunctuationHelper();

  @Emit()
  @Watch("dragSelectBoundaries")
  onBoundariesChange(boundaries: string[]) {
    if (boundaries?.length >= 1) {
      const lastEl: any = this.$refs[`item-${boundaries[1]}`];
      const top = lastEl[0].getBoundingClientRect()?.top;
      const left = lastEl[0].getBoundingClientRect()?.left;

      return {
        coords: { top, left },
        draftAnnotation: this.selectedWords
      };
    }
  }

  get selectedWords() {
    return this.paragraphs
      .flat()
      .filter(p => this.isInRange(p, this.dragSelectBoundaries));
  }

  get annotations(): Annotation[] {
    return annotateModule.annotations;
  }

  get words() {
    return this.paragraphs.flat();
  }

  wordAnnotationColor(word: Word): string {
    const annotation = this.annotations.find(a => {
      return this.isInRange(word, this.getBoundaries(a));
    });
    return annotation?.entity?.color || "red";
  }

  wordMargin(word: Word): string {
    if (word.tag === "punctuation" || ["»", " «"].includes(word.value)) {
      return this.punctuationHelper.spacePunctuationWord(word.value as Punct);
    }
    return this.isAnnotated(word) ? "10px 0px" : "10px 10px";
  }

  bgColor(word: Word) {
    if (!this.isAnnotated(word)) {
      return "transparent";
    }
    return this.wordAnnotationColor(word);
  }

  wordStyles(word: Word) {
    return {
      backgroundColor: this.bgColor(word),
      padding: this.isAnnotated(word) ? "0 10px" : "0",
      margin: this.wordMargin(word)
    };
  }

  onClickOutside(e: any) {
    if (FLOATING_BTN.includes(e?.target?.id)) {
      return;
    }

    this.dragSelectBoundaries = [];
  }

  getBoundaries(annotation: Annotation): string[] {
    return [
      `${annotation.start.paragraphIndex}-${annotation.start.wordIndex}`,
      `${annotation.end.paragraphIndex}-${annotation.end.wordIndex}`
    ];
  }

  get annotationsBoundaries(): string[][] {
    return this.annotations.map(this.getBoundaries);
  }

  isAnnotated(word: Word) {
    return this.annotationsBoundaries.some(b => this.isInRange(word, b));
  }

  isDragSelected(word: Word) {
    return this.isInRange(word, this.dragSelectBoundaries);
  }

  isInRange(item: Word, boundaries?: string[]): boolean {
    if (!boundaries?.length) return false;
    const [startCoords, endCoords] = this.getCoords(boundaries);

    return (
      this.isAfterStart(item, startCoords) && this.isBeforeEnd(item, endCoords)
    );
  }

  isAfterStart(item: Word, [startPIndex, startWIndex]: number[]): boolean {
    if (item.paragraphIndex === startPIndex) {
      return item.wordIndex >= startWIndex;
    }
    return item.paragraphIndex > startPIndex;
  }
  isBeforeEnd(item: Word, [endPIndex, endWordIndex]: number[]): boolean {
    if (item.paragraphIndex === endPIndex) {
      return item.wordIndex <= endWordIndex;
    }
    return item.paragraphIndex < endPIndex;
  }

  handleChange(draggedItems: string[]) {
    if (draggedItems?.length < 2) return;
    this.dragSelectBoundaries = [first(draggedItems)!, last(draggedItems)!];
  }

  handleClick(item: Word) {
    this.dragSelectBoundaries = [item.uniqId, item.uniqId];
  }

  getCoords([first, last]: string[]): number[][] {
    return [first.split("-"), last.split("-")].map(([pI, wI]) => [+pI, +wI]);
  }
}
</script>
<style scoped lang="stylus">
.word
  word-break break-all
</style>
