<template>
  <v-card color="grey darken-3" dark outlined class="loginCard">
    <v-card-title>Login</v-card-title>
    <v-spacer />
    <v-card-text>
      <v-form>
        <v-text-field
          ref="username"
          v-model="username"
          :rules="[() => !!username || 'This field is required']"
          prepend-icon="mdi-account"
          label="Login"
          placeholder="TotallyNotThanos"
          required
        />
        <v-text-field
          ref="password"
          v-model="password"
          :rules="[() => !!password || 'This field is required']"
          :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
          :type="showPassword ? 'text' : 'password'"
          prepend-icon="mdi-lock"
          label="Password"
          placeholder="*********"
          counter
          required
          @keydown.enter="login"
          @click:append="showPassword = !showPassword"
        />
      </v-form>
    </v-card-text>
    <v-divider class="mt-5" />
    <v-card-actions class="py-3">
      <v-spacer />
      <v-btn
        color="orange darken-3"
        align-center
        justify-center
        large
        @click="login"
        >Se Connecter
      </v-btn>
      <v-spacer />
    </v-card-actions>
    <v-snackbar v-model="snackbar" :color="color" :top="true">
      {{ errorMessages }}
      <v-btn dark text @click="snackbar = false">
        Close
      </v-btn>
    </v-snackbar>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
  components: {}
})
export default class LoginForm extends Vue {
  username = "";
  password = "";
  errorMessages = "Incorrect login info";
  snackbar = false;
  color = "general";
  showPassword = false;

  async login() {
    console.log("POUET");
  }
}
</script>
<style lang="stylus">
.v-application .grey
  .loginCard
    border-color #E0E0E0 !important
</style>
