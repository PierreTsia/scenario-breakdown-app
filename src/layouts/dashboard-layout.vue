<template>
  <v-app dark :style="{ background: $vuetify.theme.themes[theme].background }">
    <drawer :is-opened="drawerIsShown" @on-drawer-input-change="toggleDrawer" />
    <toolbar @on-drawer-icon-click="toggleDrawer" />
    <base-modal :is-opened="openDialog" />
    <annotate-modal :is-opened="isAnnotating" @on-close-modal="closeModal" />

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
import BaseModal from "@/components/core/BaseModal.vue";
import { Component, Vue } from "vue-property-decorator";
import { annotateModule } from "@/store/modules/annotate";
import { dialogModule } from "@/store/modules/dialog";

@Component({ components: { Toolbar, Drawer, AnnotateModal, BaseModal } })
export default class DashboardLayout extends Vue {
  drawerIsShown = false;

  get openDialog() {
    return dialogModule.isOpened;
  }

  get isAnnotating() {
    return annotateModule.isAnnotating;
  }

  get theme() {
    return this.$vuetify.theme.dark ? "dark" : "light";
  }

  toggleDrawer(value: boolean) {
    this.drawerIsShown = value;
  }

  async closeModal() {
    await this.$router
      .push({
        name: "Project",
        params: { projectId: this.$route.params.projectId }
      })
      // eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/no-unused-vars
      .catch(_ => {});
    return annotateModule.setAnnotatedChapter({ chapter: null });
  }
}
</script>
<style lang="stylus">
#dashboard-layout
  padding 0 !important
</style>
