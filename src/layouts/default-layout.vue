<template>
  <v-app dark>
    <v-main>
      <v-fade-transition mode="in-out">
        <v-container
          fill-height
          fluid
          id="default-layout"
          class="grey darken-4"
        >
          <slot />
        </v-container>
      </v-fade-transition>
    </v-main>
  </v-app>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
@Component({})
export default class DefaultLayout extends Vue {}
</script>
<style lang="stylus">
#default-layout
  height 100vh
  outline 1px solid red
</style>
