<template>
  <component :is="`${layout}-layout`">
    <router-view />
  </component>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { namespace } from "vuex-class";
import DefaultLayout from "@/layouts/default-layout.vue";
import DashboardLayout from "@/layouts/dashboard-layout.vue";
import UploadService from "@/api/upload.service";

const appModule = namespace("app");

@Component({
  components: { DefaultLayout, DashboardLayout }
})
export default class App extends Vue {
  @appModule.State("isDark") isDark!: boolean;
  @appModule.Mutation("setDarkMode") setDarkMode!: (val: boolean) => void;

  @Watch("isDark", { immediate: true })
  onDarkModeChange(isDark: boolean) {
    this.$vuetify.theme.dark = isDark;
  }

  mounted() {
    const isDark = localStorage.getItem("theme") === "dark";
    this.setDarkMode(isDark);
  }

  get layout() {
    return this.$route?.meta?.layout ?? "default";
  }
}
</script>
