<template>
  <v-dialog
    v-model="isShown"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <v-card v-if="chapter" class="annotate-modal">
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="onClose">
          <v-icon v-text="icons.Close" />
        </v-btn>
        <v-toolbar-title>{{ chapter.title }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn dark text @click="onClose">
            Save
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <v-speed-dial
        v-model="isTagBtnShown"
        v-if="draft && draft.length"
        direction="right"
        absolute
        transition="slide-x-transition"
        :style="{ top: coords.top, left: coords.left }"
      >
        <template v-slot:activator>
          <v-btn
            v-model="isTagBtnShown"
            color="blue darken-2"
            class="tagBtn pa-4"
            dark
            fab
          >
            <v-icon v-if="isTagBtnShown" class="tagBtn" v-text="icons.Close" />
            <v-icon v-else class="tagBtn" v-text="icons.Pen" />
          </v-btn>
        </template>
        <v-btn
          fab
          dark
          small
          color="green"
          class="tagBtn"
          @click="openAnnotationPanel"
        >
          <v-icon class="tagBtn" v-text="icons.Stamper" />
        </v-btn>
        <v-btn fab dark small color="red" class="tagBtn">
          <v-icon class="tagBtn" v-text="icons.Delete" />
        </v-btn>
      </v-speed-dial>

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
            <v-list-item-title>
              <v-row class="d-flex align-center">
                <v-col cols="2"
                  ><span class="text-subtitle-1"
                    >Paragraphs per page :</span
                  ></v-col
                >
                <v-col cols="2" offset="1"
                  ><v-select
                    v-model="numberOfParagraphsPerPage"
                    :items="[1, 3, 5, 10, 20, 50, 100]"
                /></v-col>
              </v-row>
            </v-list-item-title>
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
            :full-text="activeParagraphsFullText"
            @on-boundaries-change="handleSelectedDebounced"
          />
        </v-list-item>
      </v-list>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Watch } from "vue-property-decorator";
import ParagraphViewer from "@/views/annotate/ParagraphViewer.vue";
import OpenCloseMixin from "@/components/mixins/OpenClose.mixin";
import { annotateModule } from "@/store/modules/annotate";
import { paginationModule } from "@/store/modules/pagination";
import { authModule } from "@/store/modules/auth";
import { Icons } from "@/components/core/icons/icons-names.enum";
import { Word } from "@/dtos/Word.dto";
import range from "lodash/range";
import debounce from "lodash/debounce";
import { Chapter } from "@/dtos/Chapter.dto";
import { User } from "@/dtos/User.dto";
import { DraftAnnotationFactory } from "@/factories/draft-annotation.factory";
import { chaptersModule } from "@/store/modules/chapters";

@Component({ components: { ParagraphViewer } })
export default class AnnotateModal extends OpenCloseMixin {
  paginationIndex = 1;
  numberOfParagraphsPerPage = 10;
  icons = Icons;
  coords = { top: "500px", left: "20px" };
  draft: Word[] = [];
  isTagBtnShown = false;

  handleSelectedDebounced = debounce(this.onSelectedText, 300);

  @Watch("isShown")
  async onVisible(isShown: boolean) {
    if (isShown) {
      const { projectId } = this.$route.params;
      await annotateModule.fetchAnnotations({
        projectId,
        chapterId: annotateModule.chapter?.id
      });
    }
  }

  @Watch("activeIndices")
  async onPageChange(indices: number[]) {
    if (indices.some(i => !annotateModule.wordsByParagraphs.has(i))) {
      await chaptersModule.getChapterParagraphs({
        chapterId: annotateModule?.chapter?.id as string,
        start: indices[0],
        limit: 50
      });
    }
  }

  get chapter() {
    return annotateModule.chapter;
  }
  get me() {
    return authModule.currentUser;
  }

  get counts() {
    return paginationModule.meta;
  }

  get activeParagraphsWords(): Word[][] {
    return this.activeIndices.map(
      i => annotateModule.wordsByParagraphs.get(i) ?? []
    );
  }

  get activeParagraphsFullText(): string[] {
    return this.activeIndices.map(
      i => annotateModule.paragraphsFullText[i] ?? ""
    );
  }

  get totalPages() {
    return Math.ceil(this.counts.total / this.numberOfParagraphsPerPage);
  }

  get activeIndices() {
    const start = (this.paginationIndex - 1) * this.numberOfParagraphsPerPage;
    const end = start + this.numberOfParagraphsPerPage;
    return range(start, end);
  }

  onSelectedText({
    coords,
    draftAnnotation
  }: {
    coords: { top: number; left: number };
    draftAnnotation: Word[];
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

  async openAnnotationPanel() {
    if (this.draft?.length) {
      if (!this.me) {
        await authModule.getCurrentUser();
      }
      const factory = new DraftAnnotationFactory(
        this.draft,
        this.chapter as Chapter,
        this.me as User
      );
      annotateModule.setDraftAnnotation(factory.create());
    }
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
