<template>
  <v-container
    :class="isDarkMode ? ['grey', 'darken-4'] : ['grey', 'lighten-4']"
    class="py-12 px-0 px-sm-12"
  >
    <v-card flat tile>
      <v-list
        :class="isDarkMode ? ['grey', 'darken-4'] : ['grey', 'lighten-4']"
      >
        <v-list-item class="justify-center r">
          <v-row
            class="d-inline-flex justify-start relative"
            v-click-outside="onClickOutside"
          >
            <v-menu
              v-model="showMenu"
              absolute
              offset-y
              :position-y="menuPosition.y"
              :position-x="menuPosition.x"
              transition="scale-transition"
            >
              <v-list>
                <v-list-item v-for="(item, index) in items" :key="index">
                  <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
            <drag-select
              class="word--container d-inline-flex"
              attribute="dragSelectAttr"
              @change="handleChange"
            >
              <div
                v-for="item in words"
                :ref="`item-${item.uniqId}`"
                @click="e => handleClick(item, e)"
                :key="item.uniqId"
                :dragSelectAttr="item.uniqId"
                :style="wordStyles(item)"
                :class="wordClasses(item)"
                class="word"
              >
                <span>
                  {{ item.value }}
                </span>
              </div>
            </drag-select>
          </v-row>
        </v-list-item>
      </v-list>
    </v-card>
  </v-container>
</template>
<script lang="ts">
import { Component, Emit, Prop, Vue, Watch } from "vue-property-decorator";
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
  @Prop({ default: [] })
  fullText!: string[];
  dragSelectBoundaries: string[] = [];
  icons = Icons;
  punctuationHelper = new PunctuationHelper();
  items = [{ title: "bonjour hugo" }, { title: "Click Me" }];
  showMenu = false;
  menuPosition = { x: 500, y: 500 };

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
    return `${annotation?.entity?.color}66` || "red";
  }

  wordMargin(word: Word): string {
    if (this.isAPunctuation(word)) {
      return this.punctuationHelper.spacePunctuationWord(word.value as Punct);
    }
    return "0 2px";
  }

  bgColor(word: Word) {
    if (!this.isAnnotated(word) && !this.isDragSelected(word)) {
      return "transparent";
    }

    return this.isDragSelected(word)
      ? "#B3E5FC66"
      : this.wordAnnotationColor(word);
  }

  wordStyles(word: Word) {
    return {
      "--bg-color": this.bgColor(word),
      margin: this.wordMargin(word)
    };
  }

  isLastWordOfParagraph(word: Word): boolean {
    const par = this.paragraphs.find(
      words => words[0]?.paragraphId === word.paragraphId
    );
    const following = par?.[word.wordIndex + 1];
    return !following;
  }

  wordClasses(word: Word) {
    let classes: string[] = [];
    if (this.isDragSelected(word)) {
      classes = ["accent--text", "font-weight-bold"];
    }
    const color = this.isDarkMode ? "white" : "black";
    classes.push(`${color}--text`);
    if (this.isLastWordOfParagraph(word)) {
      classes.push("--isLastWord");
    }
    return classes;
  }

  onClickOutside(e: any) {
    if (e?.target?.className?.split(" ")?.includes(TAG_BTN)) {
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

  handleClick(item: Word, event: any) {
    if (this.isAnnotated(item)) {
      console.log(event);
      this.menuPosition = { x: event.clientX, y: event.clientY };
      this.dragSelectBoundaries = [];
      return (this.showMenu = !this.showMenu);
    }
    this.dragSelectBoundaries = [item.uniqId, item.uniqId];
  }

  getCoords([first, last]: string[]): number[][] {
    return [first.split("-"), last.split("-")].map(([pI, wI]) => [+pI, +wI]);
  }
}
</script>
<style scoped lang="stylus">
.word--container
  flex-wrap wrap
  .word
    word-break break-all
    position relative
    z-index 2
    height 20px
    &:before
      content ""
      position absolute
      width calc(100% + 4px)
      height 100%
      top 0
      left calc(0-2px)
      background-color var(--bg-color)
</style>

<!--


&.--isLastWord
      outline 1px solid saddlebrown
      &:after
        content ''
        position relative
        top 0
        left 100%
        width 200px
        border 1px solid red
        margin-right calc(100vw - 100px)
-->
