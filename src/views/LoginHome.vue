<template>
  <v-container fluid :dark="$vuetify.theme.dark">
    <v-row class="mb-6" justify="center" align="center" no-gutters>
      <v-col cols="12">
        <v-sheet>
          <h3
            class="text-center subtitle-1"
            :style="{ background: $vuetify.theme.themes[theme].background }"
          >
            {{ header }}
            <span class="cta accent--text" @click="toggleActiveMethod">{{
              cta
            }}</span>
          </h3>
        </v-sheet>
      </v-col>
      <v-col sm="12" md="6" lg="5" xl="4">
        <LoginCard
          v-if="activeMethod === signMethod.Login"
          class="mx-auto"
          @on-login-confirm-click="auth.login"
        />
        <SignupCard
          v-if="activeMethod === signMethod.Signup"
          class="mx-auto"
          @on-signup-confirm-click="auth.signup"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { authModule } from "@/store/modules/auth";

import LoginCard from "@/components/LoginCard.vue";
import SignupCard from "@/components/SignupCard.vue";

enum SignMethod {
  Login = "Login",
  Signup = "Signup"
}

@Component({
  components: { LoginCard, SignupCard }
})
export default class LoginHome extends Vue {
  auth = authModule;
  activeMethod: SignMethod = SignMethod.Login;
  signMethod = SignMethod;

  get header() {
    return this.activeMethod === SignMethod.Login
      ? this.$t("auth.unregistered")
      : this.$t("auth.registered");
  }

  get cta() {
    return this.activeMethod === SignMethod.Login
      ? this.$t("auth.create")
      : this.$t("auth.connect");
  }

  get theme() {
    return this.$vuetify.theme.dark ? "dark" : "light";
  }

  toggleActiveMethod() {
    this.activeMethod =
      this.activeMethod === SignMethod.Signup
        ? SignMethod.Login
        : SignMethod.Signup;
  }
}
</script>
<style lang="stylus">
.cta
  cursor pointer
</style>
