<template>
  <v-container :class="themeClasses" class="py-12 px-0 px-sm-12">
    <v-card flat tile>
      <v-list :class="themeClasses">
        <v-list-item class="justify-center r">
          <v-row
            class="d-inline-flex justify-start relative"
            v-click-outside="onClickOutside"
          >
            <v-menu
              v-model="showMenu"
              absolute
              offset-y
              transition="scale-transition"
              :position-y="menuPosition.y"
              :position-x="menuPosition.x"
            >
              <!--              <annotation-card
                :annotation="selectedAnnotation"
                @on-delete-click="handleDelete"
              />-->
              <attribute-card
                :attribute="selectedAttribute"
                :created-by="attributeCreatedBy"
                :annotation-id="
                  selectedAnnotation ? selectedAnnotation.id : null
                "
                @on-delete-click="handleDelete"
              />
            </v-menu>
            <drag-select
              class="word--container d-inline-flex"
              attribute="dragSelectAttr"
              @change="handleChange"
            >
              <div
                v-for="item in words"
                :ref="`item-${item.uniqId}`"
                :key="item.uniqId"
                :dragSelectAttr="item.uniqId"
                :style="wordStyles(item)"
                :class="wordClasses(item)"
                class="word"
                @click="e => handleClick(item, e)"
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
import AnnotationCard from "@/views/annotate/AnnotationCard.vue";
import AttributeCard from "@/views/annotate/AttributeCard.vue";
import { Entity } from "@/dtos/Entity.dto";
import { entitiesModule } from "@/store/modules/entities";
import { attributesModule } from "@/store/modules/attributes";
import { Attribute } from "@/dtos/Attribute.dto";
import { User } from "@/dtos/User.dto";
const TAG_BTN = "tagBtn";

@Component({ components: { DragSelect, AnnotationCard, AttributeCard } })
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
  selectedAnnotation: Annotation | null = null;
  selectedAttribute: Attribute | null = null;

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

  get entities(): Entity[] {
    return entitiesModule.entities;
  }

  get attributes() {
    return attributesModule.attributes;
  }

  get words() {
    return this.paragraphs.flat();
  }

  get themeClasses() {
    return this.isDarkMode ? ["grey", "darken-4"] : ["grey", "lighten-4"];
  }

  get attributeCreatedBy(): User {
    return this.selectedAnnotation
      ? this.selectedAnnotation.createdBy
      : { username: "Stabylo" };
  }

  isAPunctuation(word: Word) {
    return word.tag === "punctuation" || ["»", "«"].includes(word.value);
  }

  attributeEntity(word: Word) {
    return this.entities.find(e => e.id === word.entityType);
  }

  wordAnnotation(word: Word): Annotation | undefined {
    return this.annotations.find(a =>
      this.isInRange(word, this.getBoundaries(a))
    );
  }

  wordAnnotationColor(word: Word): string {
    const annotation = this.wordAnnotation(word);
    return `${annotation?.attribute?.entity?.color}66`;
  }

  wordMargin(word: Word): string {
    if (this.isAPunctuation(word)) {
      return this.punctuationHelper.spacePunctuationWord(word.value as Punct);
    }
    return "0 2px";
  }

  bgColor(word: Word) {
    if (word?.uid) {
      return `${this.attributeEntity(word)?.color}66`;
    } else if (!this.isAnnotated(word) && !this.isDragSelected(word)) {
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

  wordClasses(word: Word) {
    let classes: string[] = [];
    if (this.isDragSelected(word)) {
      classes = ["accent--text", "font-weight-bold"];
    }
    classes.push(`${this.isDarkMode ? "white" : "black"}--text`);
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
    if (this.isAnnotated(item) || item?.uid) {
      this.menuPosition = { x: event.clientX, y: event.clientY };
      this.dragSelectBoundaries = [];

      if (this.isAnnotated(item)) {
        const annotation = this.wordAnnotation(item)!;
        this.selectedAnnotation = annotation;
        this.selectedAttribute = annotation.attribute;
      } else {
        this.selectedAnnotation = null;
        this.selectedAttribute = this.attributes.find(a => a.id === item.uid)!;
      }
      return (this.showMenu = !this.showMenu);
    }
    this.dragSelectBoundaries = [item.uniqId, item.uniqId];
  }

  async handleDelete(annotationIds: string[]) {
    await annotateModule.deleteAnnotation({ annotationIds });
    this.showMenu = false;
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
