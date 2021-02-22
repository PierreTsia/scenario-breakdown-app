<template>
  <v-card v-if="me">
    <v-navigation-drawer
      v-model="drawer"
      temporary
      app
      :color="$vuetify.theme.dark ? 'primary darken-3' : 'primary lighten-3'"
      dark
      @input="input => onDrawerInputChange(input)"
    >
      <v-list>
        <v-list-item class="px-2">
          <v-list-item-avatar>
            <v-img src="https://i.pravatar.cc/150"></v-img>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title class="title">
              {{ me.username }}
            </v-list-item-title>
            <v-list-item-subtitle>{{ me.email }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>
      <v-list-item-group v-model="selectedMenu">
        <v-list-item
          link
          v-for="(item, i) in mainMenuItems"
          :key="i"
          :to="item.to"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-title class="white--text">{{
            item.label
          }}</v-list-item-title>
        </v-list-item>

        <v-list-item @click="logout">
          <v-list-item-icon>
            <v-icon>mdi-logout-variant</v-icon>
          </v-list-item-icon>
          <v-list-item-title>{{ $t("auth.logout") }}</v-list-item-title>
        </v-list-item>
      </v-list-item-group>
    </v-navigation-drawer>
  </v-card>
</template>
<script lang="ts">
import { Component, Emit, Prop, Vue, Watch } from "vue-property-decorator";
import { namespace } from "vuex-class";
import { User } from "@/dtos/User.dto";
import { Locale } from "@/store/modules/app";

const authModule = namespace("auth");
const appModule = namespace("app");
@Component({})
export default class Drawer extends Vue {
  @Prop({ required: true, default: false, type: Boolean }) isOpened!: boolean;

  @authModule.State("currentUser") me!: User;
  @authModule.Action("logout") logout!: () => Promise<void>;

  @appModule.State("userLocale") userLocale!: Locale;
  @appModule.Mutation("setLocale") setLocale!: (locale: Locale) => void;

  drawer = false;
  selectedMenu = null;
  isSettingsOpened = false;


  @Watch("isOpened", { immediate: true })
  onPropsChanges(newState: boolean) {
    this.drawer = newState;
  }

  @Emit()
  onDrawerInputChange(state: boolean) {
    return state;
  }

  get mainMenuItems() {
    return [
      {
        icon: "mdi-folder",
        label: this.$t("menu.projects"),
        to: "/dashboard/projects"
      },
      {
        icon: "mdi-cog",
        label: this.$t("menu.settings"),
        to: "/dashboard/settings"
      }
    ];
  }


}
</script>
