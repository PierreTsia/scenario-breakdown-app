<template>
  <v-container fluid>
    <AssetSecureFile class="asset" :width="400" :height="400" />
    <v-slide-y-transition group tag="div" class="d-flex row col-12">
      <v-col sm="12" md="6" v-for="project in projects" :key="project.id">
        <ProjectCard :project="project" @on-delete-project="deleteProject" />
      </v-col>
    </v-slide-y-transition>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { projectsModule } from "@/store/modules/projects";
import ProjectCard from "@/components/ProjectCard.vue";
import AssetSecureFile from "@/components/core/assets/AssetSecureFile.vue";

@Component({
  components: { ProjectCard, AssetSecureFile }
})
export default class Projects extends Vue {
  isLoading = false;
  fab = false;

  get projects() {
    return projectsModule.projects;
  }

  async deleteProject(projectId: string) {
    await projectsModule.deleteProject(projectId);
  }

  async mounted() {
    this.isLoading = true;
    await projectsModule.fetchProjects();
    this.isLoading = false;
  }
}
</script>
<style lang="stylus">
.asset
  position absolute
  right 0
  bottom 10px
  z-index 0
</style>
