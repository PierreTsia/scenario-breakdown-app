<template>
  <v-card outlined class="loginCard">
    <v-card-title>{{ $t("auth.login") }}</v-card-title>
    <v-spacer />
    <v-card-text>
      <v-form>
        <v-text-field
          ref="email"
          v-model="email"
          :rules="[() => !!email || this.$t('validation.required')]"
          prepend-icon="mdi-at"
          label="Email"
          placeholder="johndoe@mail.com"
          required
        />
        <v-text-field
          ref="password"
          v-model="password"
          :rules="[() => !!password || this.$t('validation.required')]"
          :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
          :type="showPassword ? 'text' : 'password'"
          prepend-icon="mdi-lock"
          :label="$t('auth.password')"
          placeholder="*********"
          counter
          required
          @keydown.enter="onLoginConfirmClick"
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
        @click="onLoginConfirmClick"
        >{{ $t("auth.login") }}
      </v-btn>
      <v-spacer />
    </v-card-actions>
    <v-snackbar v-model="snackbar" :color="color" :top="true">
      {{ errorMessages }}
      <v-btn dark text @click="snackbar = false">
        {{ $t("global.close") }}
      </v-btn>
    </v-snackbar>
  </v-card>
</template>

<script lang="ts">
import { Component, Emit, Vue } from "vue-property-decorator";

@Component({
  components: {}
})
export default class LoginForm extends Vue {
  email = "";
  password = "";
  errorMessages = "Incorrect login info";
  snackbar = false;
  color = "general";
  showPassword = false;

  @Emit()
  onLoginConfirmClick() {
    return { email: this.email, password: this.password };
  }
}
</script>
