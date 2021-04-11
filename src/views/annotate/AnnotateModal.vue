<template>
  <v-dialog
    v-model="dialog"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <v-card v-if="chapter">
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
      <v-list three-line subheader>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>Content summary</v-list-item-title>
            <v-list-item-subtitle
              >{{ counts.total }} total paragraphs
            </v-list-item-subtitle>
            <v-list-item-subtitle
              >{{ counts.pageNumber + 1 }} / {{ counts.pagesCount + 1 }} pages
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-divider></v-divider>
      <v-list three-line subheader>
        <v-subheader>Settings</v-subheader>
        <v-list-item class="justify-center">
          <v-list-item-content>
            <v-list-item-title>Paragraphs per page : </v-list-item-title>
            <v-list-item-subtitle>
              <v-select
                v-model="numberOfParagraphsPerPage"
                :items="[1, 3, 5, 10, 20, 50, 100]"
              />
            </v-list-item-subtitle>
            <v-list-item-subtitle>
              {{ totalPages }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-item class="justify-center">
          <v-pagination
            v-model="paginationIndex"
            :length="totalPages"
            :total-visible="7"
          />
        </v-list-item>
        <v-list-item v-if="activeParagraphsWords">
          <paragraph-viewer :paragraphs="activeParagraphsWords" />
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
import { chaptersModule } from "@/store/modules/chapters";
import { range } from "lodash";

@Component({ components: { ParagraphViewer } })
export default class AnnotateModal extends Vue {
  @Prop({ required: true, default: false, type: Boolean }) isOpened!: boolean;

  @Watch("isOpened", { immediate: true })
  onPropsChanges(newState: boolean) {
    this.dialog = newState;
  }
  @Watch("paginationIndex")
  async onPageChange(newPage: number) {
    if (
      this.chapter?.id &&
      (this.needsToFetchNext(newPage) || this.needsToFetchPrevious(newPage))
    ) {
      const start = this.needsToFetchPrevious(newPage)
        ? newPage - 10
        : newPage - 1;
      await chaptersModule.getChapterParagraphs({
        chapterId: this.chapter.id as string,
        start,
        limit: this.numberOfParagraphsPerPage < 50 ? 20 : 50
      });
    }
  }

  @Emit()
  onCloseModal() {
    return;
  }

  dialog = false;
  notifications = false;
  sound = true;
  widgets = false;
  paginationIndex = 1;
  numberOfParagraphsPerPage = 3;

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

  needsToFetchNext(currentIndex: number) {
    return !annotateModule.wordsByParagraphs.has(
      currentIndex + this.numberOfParagraphsPerPage
    );
  }

  needsToFetchPrevious(currentIndex: number) {
    return (
      currentIndex > this.numberOfParagraphsPerPage &&
      !annotateModule.wordsByParagraphs.has(
        currentIndex - this.numberOfParagraphsPerPage
      )
    );
  }
}
</script>
