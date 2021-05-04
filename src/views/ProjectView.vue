<template>
  <v-container fluid dark :class="['pt-16', { 'px-1': isMobile }]">
    <asset-inspection
      :width="$vuetify.breakpoint.xsOnly ? 200 : 400"
      :height="$vuetify.breakpoint.xsOnly ? 200 : 400"
      class="asset"
    />

    <template v-if="project">
      <v-row class="col-12">
        <h1
          class="primary--text d-flex justify-space-between align-center menu_title"
        >
          <span class="mr-6 heading text-uppercase">
            {{ project.title }}
          </span>
        </h1>
      </v-row>
      <v-row class="mt-2 col-12 ma-0" :class="{ 'px-0': isMobile }">
        <v-col
          :cols="$vuetify.breakpoint.mdAndUp ? '2' : '12'"
          :class="{ 'px-0': isMobile }"
        >
          <v-tabs
            v-model="activeTab"
            background-color="transparent"
            :dark="$vuetify.theme.dark"
            :vertical="$vuetify.breakpoint.mdAndUp"
            :show-arrows="$vuetify.breakpoint.smAndDown"
          >
            <v-tab v-for="(item, i) in tabs" :key="i">
              {{ $t(item.tab) }}</v-tab
            >
          </v-tabs>
        </v-col>
        <v-col
          :cols="$vuetify.breakpoint.mdAndUp ? '10' : '12'"
          :class="{ 'px-0': isMobile }"
        >
          <v-tabs-items v-model="activeTab">
            <v-tab-item v-for="t in tabs" :key="t.tab">
              <v-card flat color="elevation">
                <component
                  :is="tabs[activeTab].component"
                  :project="project"
                  @onUploadComplete="fetch"
                />
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { projectsModule } from "@/store/modules/projects";
import AssetInspection from "@/components/core/assets/AssetInspection.vue";
import ProjectEntities from "@/components/project/ProjectEntities.vue";
import ProjectAnnotations from "@/components/project/ProjectAnnotations.vue";
import ProjectSearch from "@/components/project/ProjectSearch.vue";
import ProjectOverview from "@/components/project/ProjectOverview.vue";
import { entitiesModule } from "@/store/modules/entities";
import { attributesModule } from "@/store/modules/attributes";
enum Tabs {
  Overview = "overview",
  Search = "search",
  Entities = "entities",
  Annotations = "annotations"
}

@Component({
  components: {
    ProjectEntities,
    ProjectAnnotations,
    ProjectSearch,
    ProjectOverview,
    AssetInspection
  }
})
export default class ProjectView extends Vue {
  tabs = Object.values(Tabs).map(t => ({
    tab: `tabs.${t}`,
    component: `project-${t}`
  }));
  activeTab = 0;

  get project() {
    return projectsModule.project;
  }

  get isMobile() {
    return this.$vuetify.breakpoint.xsOnly;
  }

  async fetch() {
    await projectsModule.fetchProject({
      projectId: this.$route.params.projectId,
      includeParagraphs: false
    });
    await entitiesModule.fetchEntities();
    await attributesModule.fetchAttributes(this.$route.params.projectId);
  }

  async mounted() {
    await this.fetch();
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
