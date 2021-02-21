<template>
  <v-app dark>
    <Drawer :is-opened="drawerIsShown" @on-drawer-input-change="toggleDrawer" />
    <Toolbar @on-drawer-icon-click="drawerIsShown = !drawerIsShown" />
    <v-main>
      <v-fade-transition mode="in-out">
        <v-container
          fill-height
          fluid
          id="dashboard-layout"
          class="grey darken-4"
        >
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

  toggleDrawer(value: boolean) {
    this.drawerIsShown = value;
  }
}
</script>
<style lang="stylus">
#dashboard-layout
  height 100vh
</style>
