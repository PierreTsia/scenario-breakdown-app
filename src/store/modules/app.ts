import { VuexModule, Module, Mutation } from "vuex-class-modules";
import { i18n } from "@/plugins/i18n";
import vuetify from "@/plugins/vuetify";
import Vue from "vue";
export enum Locale {
  FR = "fr-FR",
  EN = "en-US"
}
@Module
export class AppModule extends VuexModule {
  userLocale: Locale = Locale.FR;
  theme: "dark" | "light" = "light";
  isDark = false;

  @Mutation
  setLocale(locale = Locale.FR) {
    i18n.locale = locale;
    localStorage.setItem("locale", locale);
    this.userLocale = locale;
  }

  @Mutation
  setDarkMode(isDark: boolean) {
    localStorage.setItem("theme", isDark ? "dark" : "light");
    this.isDark = isDark;
  }

  @Mutation
  setTheme(theme: "dark" | "light") {
    console.log("theme muta", theme);
    localStorage.setItem("theme", theme);
    console.log(vuetify);
    this.theme = theme;
    vuetify.preset.theme.dark = theme === "dark";
    console.log(Vue.prototype);
    //Vue.prototype.$vuetify.theme.dark = theme === "dark";
  }
}

// register module (could be in any file)
import store from "@/store/index";
export const appModule = new AppModule({ store, name: "app" });
