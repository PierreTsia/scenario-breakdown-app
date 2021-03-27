<template>
  <v-container fluid dark class="pt-16">
    <v-row class="col-12" v-if="project">
      <h1
        class="primary--text d-flex justify-space-between align-center menu_title"
      >
        <span class="mr-6 heading text-uppercase">
          {{ project.title }}
        </span>
        <span class="subtitle-2">{{ project.description }}</span>
      </h1>
    </v-row>
    <AssetInspection :width="400" :height="400" class="asset" />
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { projectsModule } from "@/store/modules/projects";
import AssetInspection from "@/components/core/assets/AssetInspection.vue";

@Component({
  components: { AssetInspection }
})
export default class ProjectView extends Vue {
  get project() {
    return projectsModule.project;
  }

  async mounted() {
    const storedProject = projectsModule.projects.find(
      p => p.id === this.$route.params.id
    );
    if (storedProject) {
      projectsModule.setProject(storedProject);
    } else {
      await projectsModule.fetchProject(this.$route.params.id);
    }
  }
}
</script>
<style lang="stylus">
.menu_title
  width 100%
.asset
  position absolute
  bottom 10px
  right 0
</style>
