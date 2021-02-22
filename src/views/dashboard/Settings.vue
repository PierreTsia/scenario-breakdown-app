<template>
  <v-container fluid>
    <v-row class="col-12 ">
      <v-col sm="12">
        <v-card color="elevation" width="100%" height="200px" dark
          ><v-card-title class="primary--text mb-0 pb-0">
            {{ $t("settings.localization") }}
          </v-card-title>
          <v-card-text class="grey--text">
            {{ $t("settings.localesDetails") }}
          </v-card-text>
          <v-card-actions class="px-4">
            <v-select
              :value="userLocale"
              :items="locales"
              :dark="$vuetify.theme.dark"
              :light="!$vuetify.theme.dark"
              prepend-icon="mdi-earth"
              item-value="value"
              item-text="label"
              @change="setLocale"
            />
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="col-12 ">
      <v-col sm="12">
        <v-card color="elevation" width="100%" height="200px" light
          ><v-card-title class="primary--text mb-0 pb-0">
            {{ $t("settings.theme") }}
          </v-card-title>
          <v-card-text class="grey--text">
            {{ $t("settings.themeDetails") }}
          </v-card-text>
          <v-card-actions class="accent--text">
            <v-row class="px-4">
              <v-col>
                <v-switch
                  v-model="isDark"
                  :label="themeLabel"
                  :prepend-icon="
                    $vuetify.theme.dark
                      ? 'mdi-weather-night'
                      : 'mdi-weather-sunny'
                  "
                  color="primary"
                  hide-details
                  :dark="$vuetify.theme.dark"
                ></v-switch>
              </v-col>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { Locale } from "@/store/modules/app";
import { namespace } from "vuex-class";
const appModule = namespace("app");

@Component({})
export default class Settings extends Vue {
  @appModule.State("userLocale") userLocale!: Locale;
  @appModule.Mutation("setLocale") setLocale!: (locale: Locale) => void;
  @appModule.Mutation("setTheme") setTheme!: (value: string) => void;
  @appModule.Mutation("setDarkMode") setDarkMode!: (value: boolean) => void;
  isDark = false;
  locales: { value: Locale; label: string }[] = [
    { value: Locale.FR, label: "Français" },
    { value: Locale.EN, label: "English" }
  ];

  mounted() {
    this.isDark = this.$vuetify.theme.dark;
  }

  @Watch("isDark")
  onDarkModeChange(isDark: boolean) {
    this.setDarkMode(isDark);
  }

  get themeLabel() {
    return this.$vuetify.theme.dark
      ? this.$t("settings.darkDetails")
      : this.$t("settings.lightDetails");
  }
}
</script>
