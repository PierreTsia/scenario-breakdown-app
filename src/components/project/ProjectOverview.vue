<template>
  <v-container fluid class="pa-2">
    <v-list-item two-line>
      <v-list-item-content>
        <v-list-item-title>{{ project.title }}</v-list-item-title>
        <v-list-item-subtitle>
          {{ project.description }}
        </v-list-item-subtitle>
      </v-list-item-content>
      <v-list-item-action>
        <v-btn icon>
          <v-icon color="grey lighten-1" v-text="icons.Pen" />
        </v-btn>
      </v-list-item-action>
    </v-list-item>

    <v-list-item three-line>
      <v-list-item-content>
        <template v-if="!project.chapters.length">
          <v-list-item-subtitle>
            {{ $t("projects.noChapters") }}
            <span class="caption accent--text">(*.docx format only)</span>
          </v-list-item-subtitle>
          <v-list-item-subtitle
            v-if="!document"
            class="d-flex justify-center align-center mt-6"
          >
            <v-file-input
              type="file"
              accept=".docx"
              placeholder="Upload File"
              :prepend-icon="icons.PaperClip"
              @change="onFileChanged"
            />
          </v-list-item-subtitle>
          <template v-else>
            <v-list-item-subtitle
              class="d-flex justify-center align-center mt-6"
            >
              <v-text-field
                clearable
                placeholder="Name"
                v-model="fileName"
                :prepend-icon="icons.DocumentEdit"
                @click:clear="deleteDocument"
              />
            </v-list-item-subtitle>
            <v-list-item-subtitle class="d-flex justify-center">
              <v-btn color="primary" @click="uploadDocument">
                {{ isLoading ? $t("global.loading") : $t("global.upload") }}
                <v-icon
                  v-if="!isLoading"
                  class="ml-2 pb-1"
                  dark
                  v-text="icons.Cloud"
                />
              </v-btn>
            </v-list-item-subtitle>
          </template>
        </template>

        <template v-else>
          <v-list-item-title class="d-flex justify-space-between">
            <span>{{ $tc("projects.chapters", 2) }} :</span>
            <v-menu offset-y min-width="200">
              <template v-slot:activator="{ attrs, on }">
                <v-btn icon color="grey lighten-1" v-bind="attrs" v-on="on">
                  <v-icon v-text="icons.Plus" dark />
                </v-btn>
              </template>

              <v-list>
                <v-list-item two-line>
                  <v-list-item-content>
                    <v-list-item-title>Upload new chapter</v-list-item-title>
                    <v-list-item-subtitle
                      class="d-flex justify-center align-center mt-6"
                    >
                      <v-file-input
                        type="file"
                        accept=".docx"
                        placeholder="Upload File"
                        :prepend-icon="icons.PaperClip"
                        @change="onFileChanged"
                      />
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-list-item-title>
          <template v-if="document">
            <v-list-item>
              <v-list-item-avatar>
                <v-icon class="red" dark v-text="icons.TextBoxCheck" />
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>
                  <v-text-field v-model="fileName" v-if="!isLoading" />
                </v-list-item-title>

                <v-list-item-subtitle>{{
                  isLoading ? "Loading, please wait..." : "Click to upload"
                }}</v-list-item-subtitle>
              </v-list-item-content>

              <v-list-item-action v-if="!isLoading">
                <v-btn icon @click="uploadDocument">
                  <v-icon color="grey lighten-1" v-text="icons.Cloud" />
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </template>
          <v-list-item v-for="chapter in chapters" :key="chapter.id">
            <v-list-item-avatar>
              <v-icon class="blue" dark v-text="icons.DocumentEdit" />
            </v-list-item-avatar>

            <v-list-item-content class="px-4">
              <v-badge dot overlap bottom :color="statusColor(chapter.status)">
                <v-list-item-title v-text="chapter.title" />
              </v-badge>
              <v-list-item-subtitle>date</v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-action>
              <v-menu
                offset-y
                nudge-left="160"
                nudge-bottom="5"
                min-width="200"
              >
                <template v-slot:activator="{ attrs, on }">
                  <v-btn icon :disabled="chapter.status === 'UPLOADED'">
                    <v-icon
                      color="grey lighten-1"
                      v-text="icons.Dots"
                      v-bind="attrs"
                      v-on="on"
                    />
                  </v-btn>
                </template>

                <v-list>
                  <v-list-item-group>
                    <v-list-item v-for="item in menuItems" :key="item.label">
                      <v-list-item-content>
                        <v-list-item-title
                          class="d-flex justify-space-between align-center"
                          @click="item.handler(chapter)"
                        >
                          <span> {{ $t(item.label) }} </span>
                          <v-icon v-text="item.icon" />
                        </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list-item-group>
                </v-list>
              </v-menu>
            </v-list-item-action>
          </v-list-item>
        </template>
      </v-list-item-content>
    </v-list-item>
    <v-progress-linear v-if="isLoading" indeterminate color="yellow darken-2" />
  </v-container>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { Project, Status } from "@/dtos/Project.dto";
import { projectsModule } from "@/store/modules/projects";
import { chaptersModule } from "@/store/modules/chapters";

import { Icons } from "@/components/core/icons/icons-names.enum";
import { annotateModule } from "@/store/modules/annotate";
import { Chapter } from "@/dtos/Chapter.dto";

export type MenuItem = { label: string; handler: Function; icon: Icons };
@Component
export default class ProjectOverview extends Vue {
  @Prop({ required: true }) project!: Project;
  document: File | null = null;
  fileName = "unknown document";
  isLoading = false;
  icons = Icons;
  menuItems: MenuItem[] = [
    { label: "global.delete", handler: this.deleteChapter, icon: Icons.Delete },
    {
      label: "global.annotate",
      handler: this.startAnnotation,
      icon: Icons.DocumentEdit
    },
    {
      label: "global.analyze",
      handler: this.analyzeChapter,
      icon: Icons.Robot
    }
  ];

  @Watch("chapters", { immediate: true, deep: true })
  onChaptersChange(newVal: Chapter[], oldVal?: Chapter[]) {
    /* updating one array element status fails to trigger vue-dom reactivity */
    if (oldVal?.length && newVal.length === oldVal.length) {
      this.$forceUpdate();
    }
  }

  get chapters() {
    return chaptersModule.chapters;
  }

  async onFileChanged(file?: File) {
    if (file) {
      this.document = file;
      if (file?.name) {
        this.fileName = file.name.replace(".docx", "");
      }
    } else {
      this.deleteDocument();
    }
  }

  async uploadDocument() {
    if (!this.document || !this.project?.id) {
      return;
    }
    this.isLoading = true;
    await projectsModule.uploadFileToProject({
      document: this.document,
      projectId: this.project.id,
      fileName: this.fileName
    });

    this.deleteDocument();
    this.isLoading = false;
  }

  deleteDocument() {
    this.document = null;
    this.fileName = "unknown document";
  }

  statusColor(status: Status) {
    if (status === Status.Uploaded) {
      return "red accent-4";
    }
    return status === Status.Analyzed ? "success" : "yellow accent-4";
  }

  async deleteChapter(chapter: Chapter) {
    if (chapter.id) {
      return await chaptersModule.deleteChapter({ chapterId: chapter.id });
    }
  }

  async analyzeChapter(chapter: Chapter) {
    await chaptersModule.analyzeChapter(chapter.id!);
  }

  async startAnnotation(chapter: Chapter) {
    this.isLoading = true;
    await chaptersModule.getChapterParagraphs({
      chapterId: chapter.id as string,
      start: 0,
      limit: 50
    });
    annotateModule.setAnnotatedChapter({ chapter });
    this.isLoading = false;

    await this.$router
      .push({ name: "Annotate", params: { chapterId: chapter.id as string } })
      // eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/no-unused-vars
      .catch((_: unknown) => {});
  }
}
</script>
<style lang="stylus">
.v-list-item
  cursor pointer
</style>
