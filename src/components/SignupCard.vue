<template>
  <v-card outlined class="signUpCard">
    <v-card-title>{{ $t("auth.signup") }}</v-card-title>
    <v-spacer />
    <v-card-text>
      <v-form>
        <v-text-field
          ref="username"
          v-model="username"
          :rules="[() => !!username || 'This field is required']"
          prepend-icon="mdi-account"
          :label="$t('global.username')"
          placeholder="John Doe"
          required
        />
        <v-text-field
          ref="email"
          v-model="email"
          :rules="[() => !!email || 'This field is required']"
          prepend-icon="mdi-at"
          label="Email"
          placeholder="johndoe@mail.com"
          required
        />
        <v-text-field
          ref="password"
          v-model="password"
          :rules="[() => !!password || $t('validation.required')]"
          :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
          :type="showPassword ? 'text' : 'password'"
          prepend-icon="mdi-lock"
          :label="$t('auth.password')"
          placeholder="*********"
          counter
          required
          @keydown.enter="onSignupConfirmClick"
          @click:append="showPassword = !showPassword"
        />

        <v-text-field
          ref="password2"
          v-model="passwordConfirm"
          :rules="[
            () =>
              (!!passwordConfirm && passwordConfirm === password) ||
              $t('validation.passwordMatch')
          ]"
          :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
          :type="showPassword ? 'text' : 'password'"
          prepend-icon="mdi-lock"
          :label="$t('auth.confirmPassword')"
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
        color="primary"
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
  passwordConfirm = "";
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
