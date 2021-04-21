<template>
  <v-dialog
    v-model="dialog"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <v-card v-if="chapter" class="annotate-modal">
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="onCloseModal">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>{{ chapter.title }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn dark text @click="dialog = false">
            Save
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <div
        id="floatingBtn"
        class="pa-1"
        v-show="draft && draft.length"
        color="primary"
        small
      >
        <v-btn
          id="floatingBtn__btn"
          :style="{ top: coords.top, left: coords.left }"
          dark
          fab
        >
          <v-icon id="floatingBtn__icon" v-text="icons.Plus" />
        </v-btn>
      </div>

      <v-list three-line subheader>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>Content summary</v-list-item-title>
            <v-list-item-subtitle
              >{{ counts.total }} total paragraphs - {{ totalPages }} pages
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-divider></v-divider>
      <v-list three-line subheader>
        <v-subheader>Settings</v-subheader>
        <v-list-item class="justify-center">
          <v-list-item-content>
            <v-list-item-title
              >Paragraphs per page :
              <v-select
                v-model="numberOfParagraphsPerPage"
                :items="[1, 3, 5, 10, 20, 50, 100]"
              />
            </v-list-item-title>

            <v-list-item-subtitle>
              {{ totalPages }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-item class="justify-center" ref="viewer">
          <v-pagination
            v-model="paginationIndex"
            :length="totalPages"
            :total-visible="7"
          />
        </v-list-item>
        <v-list-item v-if="activeParagraphsWords" class="list">
          <paragraph-viewer
            :paragraphs="activeParagraphsWords"
            @on-boundaries-change="handleSelectedDebounced"
          />
        </v-list-item>
      </v-list>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Emit, Prop, Vue, Watch } from "vue-property-decorator";
import ParagraphViewer from "@/views/annotate/ParagraphViewer.vue";
import { annotateModule, Word } from "@/store/modules/annotate";
import { paginationModule } from "@/store/modules/pagination";
import { Icons } from "@/components/core/icons/icons-names.enum";

import range from "lodash/range";
import debounce from "lodash/debounce";

type Coords = { top: number; left: number };
@Component({ components: { ParagraphViewer } })
export default class AnnotateModal extends Vue {
  @Prop({ required: true, default: false, type: Boolean }) isOpened!: boolean;

  @Watch("isOpened", { immediate: true })
  onPropsChanges(newState: boolean) {
    this.dialog = newState;
  }

  @Emit()
  onCloseModal() {
    return;
  }
  dialog = false;
  paginationIndex = 1;
  numberOfParagraphsPerPage = 10;
  icons = Icons;
  direction = "top";
  coords = { top: "500px", left: "20px" };
  draft = [];

  handleSelectedDebounced = debounce(this.onSelectedText, 300);

  get chapter() {
    return annotateModule.chapter;
  }

  get counts() {
    return paginationModule.meta;
  }

  get activeParagraphsWords(): Word[][] {
    return this.activeIndices.map(
      i => annotateModule.wordsByParagraphs.get(i) ?? []
    );
  }

  get totalPages() {
    return Math.ceil(this.counts.total / this.numberOfParagraphsPerPage);
  }

  get activeIndices() {
    return range(
      this.paginationIndex,
      this.paginationIndex + this.numberOfParagraphsPerPage
    );
  }

  onSelectedText({
    coords,
    draftAnnotation
  }: {
    coords: Coords;
    draftAnnotation: never[];
  }) {
    if (coords) {
      const containerEl = this.$refs.viewer as any;
      const offsetTop = containerEl.$el.getBoundingClientRect().top;

      this.coords = {
        top: `${coords.top - offsetTop + 250}px`,
        left: `${coords.left + 50}px`
      };
    }
    this.draft = draftAnnotation;
  }
}
</script>
<style lang="stylus">
.annotate-modal
  position relative
  #floatingBtn
    position absolute !important
    z-index 100 !important
</style>
