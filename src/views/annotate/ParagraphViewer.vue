<template>
  <v-container>
    <v-btn color="primary" elevation="2" fab>
      <v-icon v-text="icons.Plus" />
    </v-btn>
    <v-list>
      <v-list-item class="justify-center">
        <v-row class="d-inline-flex pa-4" v-click-outside="onClickOutside">
          <drag-select
            attribute="dragSelectAttr"
            @change="handleChange"
            class="pa-4"
          >
            <span
              v-for="item in words"
              @click="handleClick(item)"
              :key="item.uniqId"
              :dragSelectAttr="item.uniqId"
              :class="
                isInRange(item) ? ['accent--text', 'font-weight-bold'] : ''
              "
              class="d-inline-block word pa-0 ma-2 primary--text"
              >{{ item.label }}
            </span>
          </drag-select>
        </v-row>
      </v-list-item>
    </v-list>
  </v-container>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Word } from "@/store/modules/annotate";
import DragSelect from "drag-select-vue";
import first from "lodash/first";
import last from "lodash/last";
import { Icons } from "@/components/core/icons/icons-names.enum";
@Component({ components: { DragSelect } })
export default class ParagraphViewer extends Vue {
  @Prop({ default: [] })
  paragraphs!: Word[][];
  boundaries: string[] = [];
  icons = Icons;

  get selectedWords() {
    return this.paragraphs.flat().filter(this.isInRange);
  }

  get words() {
    return this.paragraphs.flat();
  }

  onClickOutside() {
    this.boundaries = [];
  }

  isSelected(uniqId: string) {
    return this.selectedWords.some(w => w.uniqId === uniqId);
  }

  isInRange(item: Word): boolean {
    if (!this.boundaries?.length) return false;
    const [startCoords, endCoords] = this.getCoords(this.boundaries);

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
    this.boundaries = [first(draggedItems)!, last(draggedItems)!];
  }

  handleClick(item: Word) {
    this.boundaries = [item.uniqId, item.uniqId];
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
