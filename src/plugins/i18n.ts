import Vue from "vue";
import VueI18n from "vue-i18n";
import locales from "./../locale";

Vue.use(VueI18n);
export const i18n = new VueI18n({
  locale: "fr-FR", // set locale
  messages: { ...locales } // set locale messages
});
