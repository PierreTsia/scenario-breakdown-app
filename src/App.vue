<template>
  <component :is="`${layout}-layout`">
    <router-view />
  </component>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import DefaultLayout from "@/layouts/default-layout.vue";
import DashboardLayout from "@/layouts/dashboard-layout.vue";

@Component({
  components: { DefaultLayout, DashboardLayout }
})
export default class App extends Vue {
  get layout() {
    return this.$route?.meta?.layout ?? "default";
  }
}
</script>
