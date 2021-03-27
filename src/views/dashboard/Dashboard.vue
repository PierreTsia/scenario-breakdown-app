<template>
  <v-container fluid>
    <v-row class="col-12 ">
      <v-col sm="12" md="6" lg="4">
        <v-card
          class="mx-auto d-flex flex-column justify-space-between"
          color="elevation"
          height="250"
        >
          <v-card-text> </v-card-text>
          <v-card-actions class="pa-4">
            <v-btn color="primary">
              Learn More
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="col-12 ">
      <v-col sm="12"> </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({})
export default class Dashboard extends Vue {}
</script>
