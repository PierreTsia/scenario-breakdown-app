<template>
  <v-app dark :style="{ background: $vuetify.theme.themes[theme].background }">
    <v-main>
      <v-fade-transition mode="in-out">
        <v-container fill-height fluid id="default-layout">
          <slot />
        </v-container>
      </v-fade-transition>
    </v-main>
  </v-app>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
@Component({})
export default class DefaultLayout extends Vue {
  get theme() {
    return this.$vuetify.theme.dark ? "dark" : "light";
  }
}
</script>
