<template>
  <v-container fluid dark>
    <h1 class="white--text">dashboardview</h1>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({})
export default class DashboardView extends Vue {
  drawer = true;
}
</script>
