<template>
  <v-row justify="end">
    <v-dialog
      v-model="dialog"
      persistent
      max-width="600px"
      class="createProjectModal"
    >
      <template v-slot:activator="{ on, attrs }">
        <span class="d-flex align-baseline">
          <p class="subtitle-2 pa-0 mr-2 text--secondary">
            {{ $t("projects.create") }}
          </p>
          <v-btn fab x-small color="secondary" v-bind="attrs" v-on="on"
            ><v-icon>mdi-plus</v-icon></v-btn
          >
        </span>
      </template>
      <v-card>
        <v-card-title>
          <span class="headline">{{ $t("projects.create") }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="12" md="12">
                <v-text-field
                  v-model="title"
                  :label="`${$t('projects.title')}*`"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="12" md="12">
                <v-textarea
                  :label="`${$t('projects.description')}*`"
                  v-model="description"
                ></v-textarea>
              </v-col>
            </v-row>
          </v-container>
          <small>{{ $t("global.requiredFields") }}</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" outlined @click="dialog = false">
            {{ $t("global.cancel") }}
          </v-btn>
          <v-btn color="primary" @click="onCreateProject">
            {{ $t("global.confirm") }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script lang="ts">
import { Component, Vue, Emit } from "vue-property-decorator";
@Component({})
export default class CreateProjectModal extends Vue {
  dialog = false;
  description = "A mock description";
  title = "";

  @Emit()
  onCreateProject() {
    this.dialog = false;
    return { description: this.description, title: this.title };
  }
}
</script>

<style lang="stylus">
.createProjectModal
  min-height 800px !important
</style>
