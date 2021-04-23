<template>
  <v-container fluid class="pa-0">
    <v-card>
      <v-card-title class="primary white--text">
        <v-spacer />
        <v-menu bottom left>
          <template v-slot:activator="{ on, attrs }">
            <v-btn dark icon v-bind="attrs" v-on="on">
              <v-icon v-text="icons.DotVertical" />
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              v-for="(item, i) in items"
              :key="i"
              @click="item.handler"
            >
              <v-list-item-icon>
                <v-icon v-text="item.icon" />
              </v-list-item-icon>
              <v-list-item-title v-text="$t(item.label)" />
            </v-list-item>
          </v-list>
        </v-menu>
      </v-card-title>
      <data-table :items="entities" :columns="properties">
        <template v-slot:default="slotProps">
          <td v-for="prop in properties" :key="prop">
            <v-chip :color="slotProps.item[prop]" v-if="prop === 'color'">
              {{ slotProps.item[prop] }}</v-chip
            >
            <span v-else> {{ slotProps.item[prop] }}</span>
          </td>
        </template>
      </data-table>
    </v-card>
  </v-container>
</template>
<script lang="ts">
import DataTable from "@/components/core/DataTable.vue";
import { Component, Vue } from "vue-property-decorator";
import { Icons } from "@/components/core/icons/icons-names.enum";
import { MenuItem } from "@/components/project/ProjectOverview.vue";
import { dialogModule, DialogName } from "@/store/modules/dialog";
import { entitiesModule } from "@/store/modules/entities";

@Component({ components: { DataTable } })
export default class ProjectEntities extends Vue {
  properties = ["label", "color"];
  icons = Icons;
  isLoading = false;

  items: MenuItem[] = [
    {
      label: "global.createNew",
      handler: this.openCreateEntityDialog,
      icon: Icons.Plus
    }
  ];

  async mounted() {
    this.isLoading = true;
    await entitiesModule.fetchEntities();
    this.isLoading = false;
  }
  get entities() {
    return entitiesModule.entities;
  }

  openCreateEntityDialog() {
    return dialogModule.setActiveDialog({ name: DialogName.CreateEntity });
  }
}
</script>
