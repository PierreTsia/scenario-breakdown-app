<template>
  <v-app dark :style="{ background: $vuetify.theme.themes[theme].background }">
    <Drawer :is-opened="drawerIsShown" @on-drawer-input-change="toggleDrawer" />
    <Toolbar @on-drawer-icon-click="toggleDrawer" />
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
import { Component, Vue } from "vue-property-decorator";
@Component({ components: { Toolbar, Drawer } })
export default class DashboardLayout extends Vue {
  drawerIsShown = false;

  get theme() {
    return this.$vuetify.theme.dark ? "dark" : "light";
  }

  toggleDrawer(value: boolean) {
    this.drawerIsShown = value;
  }
}
</script>
