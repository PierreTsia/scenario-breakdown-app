<template>
  <v-container fluid dark>
    <v-row class="mb-6" justify="center" no-gutters>
      <v-col sm="12" md="6" lg="5" xl="4">
        <LoginCard class="mx-auto" @on-login-confirm-click="auth.login" />
        <SignupCard class="mx-auto" @on-signup-confirm-click="auth.signup" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { authModule } from "@/store/modules/auth";

import LoginCard from "@/components/LoginCard.vue";
import SignupCard from "@/components/SignupCard.vue";

@Component({
  components: { LoginCard, SignupCard }
})
export default class LoginHome extends Vue {
  auth = authModule;
}
</script>
