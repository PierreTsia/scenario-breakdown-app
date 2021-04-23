<template>
  <v-card min-height="500" class="d-flex flex-column justify-space-between">
    <v-card-title class="d-flex flex-column align-start">
      <span class="text-h4 grey--text text--darken-2">New entity</span>
      <span class="text-subtitle-2 grey--text text--lighten-1"
        >Description of the creation process</span
      >
    </v-card-title>
    <v-card-text>
      <v-swatches
        v-model="color"
        popover-x="right"
        swatches="basic"
        show-fallback
      />

      <v-form ref="entityForm">
        <v-autocomplete
          v-model="projectId"
          :items="projects"
          item-text="title"
          item-value="id"
          :loading="isLoading"
          :search-input.sync="searchInput"
          chips
          label="Project"
        />
        <v-text-field v-model="label" label="Entity name" class="my-2" />
        <v-text-field
          v-model="description"
          label="Entity Description"
          class="my-2"
        />
      </v-form>
    </v-card-text>
    <v-card-actions class="justify-end pa-4">
      <v-btn text class="success white--text mr-6" @click="onCreateClick"
        >Confirm</v-btn
      >
      <v-btn outlined color="error" @click="onClose">Close</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import VSwatches from "vue-swatches";
import { Component, Vue, Emit, Watch } from "vue-property-decorator";
import { entitiesModule } from "@/store/modules/entities";
import { ValidationError } from "class-validator";
import { CreateEntityInput } from "@/dtos/Entity.dto";
import { projectsModule } from "@/store/modules/projects";
import { dialogModule } from "@/store/modules/dialog";
import debounce from "lodash/debounce";
import { Project } from "@/dtos/Project.dto";
import { plainToClass } from "class-transformer";

@Component({ components: { VSwatches } })
export default class CreateEntity extends Vue {
  label = "";
  description = "";
  color = "#1CA085";
  errors: ValidationError[] = [];
  searchInput = "";
  projectId = null;
  isLoading = false;
  debounceFetch = debounce(projectsModule.fetchProjects, 300);

  @Watch("searchInput")
  async onSearchInputChange(input?: string) {
    if (input && !this.projects.length) {
      this.debounceFetch();
    }
  }

  @Emit()
  onClose() {
    return;
  }

  get projects() {
    return this.searchInput?.length
      ? projectsModule.projects.filter(this.filterByTitle)
      : projectsModule.projects;
  }

  filterByTitle(p: Project): boolean {
    return !!p.title?.toUpperCase().startsWith(this.searchInput?.toUpperCase());
  }

  async onCreateClick() {
    const entityInput = plainToClass(CreateEntityInput, {
      label: this.label,
      projectId: this.projectId,
      description: this.description,
      color: this.color
    });

    if (await entityInput.isValid()) {
      await entitiesModule.createEntity(entityInput);
      dialogModule.closeDialog();
    } else {
      this.errors = await entityInput.errors();
    }
  }

  //color = "pouet";
}
</script>
