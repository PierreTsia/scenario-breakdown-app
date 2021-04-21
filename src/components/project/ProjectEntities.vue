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
      <data-table :items="desserts" :columns="properties">
        <template v-slot:default="slotProps">
          <td v-for="prop in properties" :key="prop">
            {{ slotProps.item[prop] }}
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

@Component({ components: { DataTable } })
export default class ProjectEntities extends Vue {
  properties = ["name", "calories"];
  icons = Icons;

  items: MenuItem[] = [
    {
      label: "global.createNew",
      handler: this.openCreateEntityDialog,
      icon: Icons.Plus
    }
  ];
  desserts = [
    {
      name: "Frozen Yogurt",
      calories: 159
    },
    {
      name: "Ice cream sandwich",
      calories: 237
    },
    {
      name: "Eclair",
      calories: 262
    },
    {
      name: "Cupcake",
      calories: 305
    },
    {
      name: "Gingerbread",
      calories: 356
    },
    {
      name: "Jelly bean",
      calories: 375
    },
    {
      name: "Lollipop",
      calories: 392
    },
    {
      name: "Honeycomb",
      calories: 408
    },
    {
      name: "Donut",
      calories: 452
    },
    {
      name: "KitKat",
      calories: 518
    }
  ];

  openCreateEntityDialog() {
    return dialogModule.setActiveDialog({ name: DialogName.CreateEntity });
  }

}
</script>
