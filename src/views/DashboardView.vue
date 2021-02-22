<template>
  <v-container fluid dark class="pt-16">
    <v-row class="col-12">
      <h1 class="primary--text">{{ $t(`menu.${$route.name}`) }}</h1>
      <component :is="activeComponent" />
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Settings from "@/views/dashboard/Settings.vue";

@Component({
  components: { Settings }
})
export default class DashboardView extends Vue {
  drawer = true;

  get activeComponent() {
    return this.$route.name;
  }
}
</script>
