<template>
  <v-container fluid dark>
    <v-row class="mb-6" justify="center" no-gutters>
      <v-col sm="12" md="6" lg="5" xl="4">
        <LoginForm class="mx-auto" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import LoginForm from "@/components/LoginCard.vue";

@Component({
  components: { LoginForm }
})
export default class LoginHome extends Vue {}
</script>
