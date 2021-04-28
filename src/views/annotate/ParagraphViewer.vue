<template>
  <v-container
    :class="isDarkMode ? ['grey', 'darken-4'] : ['grey', 'lighten-4']"
    class="py-12 px-0 px-sm-12"
  >
    <v-card flat tile>
      <v-list
        :class="isDarkMode ? ['grey', 'darken-4'] : ['grey', 'lighten-4']"
      >
        <v-list-item class="justify-center">
          <v-row class="d-inline-flex" v-click-outside="onClickOutside">
            <drag-select attribute="dragSelectAttr" @change="handleChange">
              <span
                v-for="item in words"
                :ref="`item-${item.uniqId}`"
                @click="handleClick(item)"
                :key="item.uniqId"
                :dragSelectAttr="item.uniqId"
                :style="wordStyles(item)"
                :class="
                  isDragSelected(item)
                    ? ['accent--text', 'font-weight-bold']
                    : isDarkMode
                    ? 'white--text'
                    : 'black--text'
                "
                class="d-inline-block word"
                >{{ item.value }}
              </span>
            </drag-select>
          </v-row>
        </v-list-item>
      </v-list>
    </v-card>
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
import { appModule } from "@/store/modules/app";
import { Annotation } from "@/dtos/Annotation.dto";
import { Punct, PunctuationHelper } from "@/helpers/punctuation.helper";

const TAG_BTN = "tagBtn";

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
      const top = lastEl[0].getBoundingClientRect()?.top + 50;
      const left = lastEl[0].getBoundingClientRect()?.left;

      return {
        coords: { top, left },
        draftAnnotation: this.selectedWords
      };
    }
  }

  get isDarkMode(): boolean {
    return appModule.isDark;
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

  isAPunctuation(word: Word) {
    return word.tag === "punctuation" || ["»", " «"].includes(word.value);
  }

  wordAnnotationColor(word: Word): string {
    const annotation = this.annotations.find(a => {
      return this.isInRange(word, this.getBoundaries(a));
    });
    return annotation?.entity?.color || "red";
  }

  wordMargin(word: Word): string {
    if (this.isAPunctuation(word)) {
      return this.punctuationHelper.spacePunctuationWord(word.value as Punct);
    }
    return this.isAnnotated(word) ? "5px 0px" : "5px 10px";
  }

  bgColor(word: Word) {
    if (
      this.isAPunctuation(word) ||
      (!this.isAnnotated(word) && !this.isDragSelected(word))
    ) {
      return "transparent";
    }

    return this.isDragSelected(word)
      ? "#B3E5FC66"
      : this.wordAnnotationColor(word);
  }

  wordStyles(word: Word) {
    return {
      "--bg-color": this.bgColor(word),
      padding: this.isAnnotated(word) ? "0 10px" : "0",
      margin: this.wordMargin(word)
    };
  }

  onClickOutside(e: Event) {
    if (e.target.className.split(" ").includes(TAG_BTN)) {
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
  position relative
  z-index 2
  &:before
    content ""
    position absolute
    width calc(100% + 20px)
    height 100%
    top 0
    left 0
    background-color var(--bg-color)
    z-index 1
</style>
