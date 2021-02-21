<template>
  <v-card color="grey darken-3" dark outlined class="signUpCard">
    <v-card-title>Signup</v-card-title>
    <v-spacer />
    <v-card-text>
      <v-form>
        <v-text-field
          ref="username"
          v-model="username"
          :rules="[() => !!username || 'This field is required']"
          prepend-icon="mdi-account"
          label="username"
          placeholder="johndoe@mail.com"
          required
        />
        <v-text-field
          ref="email"
          v-model="email"
          :rules="[() => !!email || 'This field is required']"
          prepend-icon="mdi-at"
          label="email"
          placeholder="johndoe@mail.com"
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
          @keydown.enter="onSignupConfirmClick"
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
        @click="onSignupConfirmClick"
        >Créer mon compte
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
import { Component, Emit, Vue } from "vue-property-decorator";

@Component({
  components: {}
})
export default class SignupCard extends Vue {
  username = "";
  email = "";
  password = "";
  errorMessages = "Incorrect login info";
  snackbar = false;
  color = "general";
  showPassword = false;

  @Emit()
  onSignupConfirmClick() {
    return {
      username: this.username,
      email: this.email,
      password: this.password
    };
  }
}
</script>
<style lang="stylus">
.v-application .grey
  .signUpCard
    border-color #E0E0E0 !important
</style>
