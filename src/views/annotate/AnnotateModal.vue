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
              >{{ chapter.paragraphCount }} paragraphs and
              {{ totalWordsCount }} words</v-list-item-subtitle
            >
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-divider></v-divider>
      <v-list three-line subheader>
        <v-subheader>Paragraphs</v-subheader>
        <v-list-item>
          {{ activeParagraph.words.join(" ") }}
        </v-list-item>

        <v-list-item class="justify-center">
          <v-pagination
            v-model="paginationIndex"
            :length="chapter.paragraphCount"
            :total-visible="7"
          />
        </v-list-item>
      </v-list>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Emit, Prop, Vue, Watch } from "vue-property-decorator";
import { annotateModule } from "@/store/modules/annotate";
import { Paragraph } from "@/dtos/Paragraph.dto";
@Component
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
  notifications = false;
  sound = true;
  widgets = false;
  paginationIndex = 1;

  get chapter() {
    return annotateModule.chapter;
  }

  get activeParagraph() {
    return this.chapter?.paragraphs?.[this.paginationIndex - 1];
  }

  get totalWordsCount(): number {
    return annotateModule.chapter?.paragraphs.reduce(
      (total: number, p: Paragraph) => (total += p?.wordsCount ?? 0),
      0
    );
  }
}
</script>
