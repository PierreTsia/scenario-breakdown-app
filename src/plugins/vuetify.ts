import Vue from "vue";
import Vuetify from "vuetify/lib/framework";
import { light, dark } from "@/plugins/theme";

const vuetify = new Vuetify({ preset: { themes: { light, dark } } });
Vue.use(Vuetify);
export default vuetify;
