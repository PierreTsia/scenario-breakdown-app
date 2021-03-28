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
          <v-icon color="grey lighten-1">mdi-pen</v-icon>
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
              prepend-icon="mdi-paperclip"
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
                prepend-icon="mdi-file-document-edit-outline"
                @click:clear="deleteDocument"
              />
            </v-list-item-subtitle>
            <v-list-item-subtitle class="d-flex justify-center">
              <v-btn color="primary" @click="uploadDocument">
                {{ $t("global.upload") }}
                <v-icon class="ml-2 pb-1" dark>mdi-cloud-upload-outline</v-icon>
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
                  <v-icon dark>mdi-plus</v-icon>
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
                        prepend-icon="mdi-paperclip"
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
                <v-icon class="red" dark>mdi-text-box-check</v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>
                  <v-text-field v-model="fileName" />
                </v-list-item-title>

                <v-list-item-subtitle>Click to upload</v-list-item-subtitle>
              </v-list-item-content>

              <v-list-item-action>
                <v-btn icon @click="uploadDocument">
                  <v-icon color="grey lighten-1"
                    >mdi-cloud-upload-outline</v-icon
                  >
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </template>
          <v-list-item v-for="chapter in project.chapters" :key="chapter.id">
            <v-list-item-avatar>
              <v-icon class="blue" dark>mdi-file-document-outline</v-icon>
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title v-text="chapter.title"></v-list-item-title>

              <v-list-item-subtitle>date</v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-action>
              <v-btn icon>
                <v-icon color="grey lighten-1">mdi-dots-horizontal</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </template>
      </v-list-item-content>
    </v-list-item>
  </v-container>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Project } from "@/dtos/Project.dto";
import { projectsModule } from "@/store/modules/projects";

@Component
export default class ProjectOverview extends Vue {
  @Prop({ required: true }) project!: Project;
  document: File | null = null;
  fileName = "unknown document";

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
    await projectsModule.uploadFileToProject({
      document: this.document,
      projectId: this.project.id,
      fileName: this.fileName
    });

    this.deleteDocument();
  }

  deleteDocument() {
    this.document = null;
    this.fileName = "unknown document";
  }
}
</script>
