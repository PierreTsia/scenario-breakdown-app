<template>
  <v-container>
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
              :ref="`item-${item.uniqId}`"
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
import { Component, Prop, Vue, Watch, Emit } from "vue-property-decorator";
import { Word } from "@/store/modules/annotate";
import DragSelect from "drag-select-vue";
import first from "lodash/first";
import last from "lodash/last";
import { Icons } from "@/components/core/icons/icons-names.enum";

const FLOATING_BTN = ["floatingBtn", "floatingBtn__icon", "floatingBtn__btn"];

@Component({ components: { DragSelect } })
export default class ParagraphViewer extends Vue {
  @Prop({ default: [] })
  paragraphs!: Word[][];
  boundaries: string[] = [];
  icons = Icons;

  @Emit()
  @Watch("boundaries")
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
    return this.paragraphs.flat().filter(this.isInRange);
  }

  get words() {
    return this.paragraphs.flat();
  }

  onClickOutside(e: any) {
    if (FLOATING_BTN.includes(e?.target?.id)) {
      return;
    }

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
