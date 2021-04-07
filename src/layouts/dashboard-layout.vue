<template>
  <v-app dark :style="{ background: $vuetify.theme.themes[theme].background }">
    <Drawer :is-opened="drawerIsShown" @on-drawer-input-change="toggleDrawer" />
    <Toolbar @on-drawer-icon-click="toggleDrawer" />
    <AnnotateModal :is-opened="isAnnotating" @on-close-modal="closeModal" />
    <v-main>
      <v-fade-transition mode="in-out">
        <v-container fluid id="dashboard-layout">
          <slot />
        </v-container>
      </v-fade-transition>
    </v-main>
  </v-app>
</template>
<script lang="ts">
import Toolbar from "@/components/core/Toolbar.vue";
import Drawer from "@/components/core/Drawer.vue";
import AnnotateModal from "@/views/annotate/AnnotateModal.vue";
import { Component, Vue } from "vue-property-decorator";
import { annotateModule } from "@/store/modules/annotate";
@Component({ components: { Toolbar, Drawer, AnnotateModal } })
export default class DashboardLayout extends Vue {
  drawerIsShown = false;

  get isAnnotating() {
    return annotateModule.isAnnotating;
  }

  get theme() {
    return this.$vuetify.theme.dark ? "dark" : "light";
  }

  toggleDrawer(value: boolean) {
    this.drawerIsShown = value;
  }

  closeModal() {
    return annotateModule.setAnnotatedChapter({ chapter: null });
  }
}
</script>
<style lang="stylus">
#dashboard-layout
  padding 0 !important
</style>
