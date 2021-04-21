<template>
  <v-simple-table fixed-header>
    <template v-slot:default>
      <thead>
        <tr>
          <th
            class="text-left text-capitalize"
            v-for="(col, i) in columns"
            v-text="col"
            :key="i"
          />
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, i) in items" :key="`item--${i}`">
          <slot v-bind:item="item" />
        </tr>
      </tbody>
    </template>
  </v-simple-table>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class DataTable extends Vue {
  @Prop({ default: () => [] }) items!: never[];
  @Prop({ default: () => [] }) columns!: string[];
}
</script>
