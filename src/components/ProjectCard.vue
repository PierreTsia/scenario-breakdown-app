<template>
  <v-card
    class="mx-auto d-flex flex-column justify-space-between"
    color="elevation"
    height="250"
  >
    <v-card-text>
      <p class="display-1 text--primary text-truncate">
        {{ project.title }}
      </p>
      <p>
        {{
          $tc("projects.chaptersCount", project.chaptersCount, {
            count: project.chaptersCount
          })
        }}
        | {{ project.creationDate }}
      </p>

      <div class="text--primary">
        {{ project.description }}
      </div>
    </v-card-text>
    <v-card-actions class="pa-4 d-flex justify-end">
      <v-btn color="primary" @click="$router.push(`/project/${project.id}`)">
        {{ $t("global.details") }}
      </v-btn>

      <v-btn color="error" outlined @click="onDeleteProject">
        <v-icon>mdi-delete</v-icon>
        {{ $t("global.delete") }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script lang="ts">
import { Component, Vue, Prop, Emit } from "vue-property-decorator";
import { Project } from "../dtos/Project.dto";
@Component({})
export default class ProjectCard extends Vue {
  @Prop({ required: true, type: Object }) project!: Project;

  @Emit()
  onDeleteProject() {
    return this.project.id;
  }
}
</script>
