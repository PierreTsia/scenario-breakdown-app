import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import apolloProvider from "@/plugins/apollo";
import { i18n } from "@/plugins/i18n";
import "reflect-metadata";

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  i18n,
  vuetify,
  apolloProvider,
  render: h => h(App)
}).$mount("#app");
