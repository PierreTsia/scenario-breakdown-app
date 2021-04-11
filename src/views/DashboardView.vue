<template>
  <v-container fluid dark class="pt-16">
    <v-row class="col-12">
      <h1
        class="primary--text d-flex justify-space-between align-center menu_title"
      >
        <span class="mr-6">
          {{ $t(`menu.${$route.name}`) }}
        </span>
        <create-project-modal
          v-if="activeComponent === 'projects'"
          @on-create-project="createProject"
        />
      </h1>
    </v-row>
    <component :is="activeComponent" />
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Settings from "@/views/dashboard/Settings.vue";
import Projects from "@/views/dashboard/Projects.vue";
import Dashboard from "@/views/dashboard/Dashboard.vue";
import CreateProjectModal from "@/components/CreateProjectModal.vue";

import { projectsModule } from "@/store/modules/projects";
import { plainToClass } from "class-transformer";
import { CreateProjectDto } from "@/dtos/CreateProject.dto";

@Component({
  components: { Settings, Projects, CreateProjectModal, Dashboard }
})
export default class DashboardView extends Vue {
  drawer = true;

  get activeComponent() {
    return this.$route.name;
  }

  async createProject(input: { title: string; description: string }) {
    const projectInput = plainToClass(
      CreateProjectDto,
      { projectInput: input },
      { excludeExtraneousValues: true }
    );
    await projectsModule.createProject(projectInput);
  }
}
</script>
<style lang="stylus">
.menu_title
  width 100%
</style>
