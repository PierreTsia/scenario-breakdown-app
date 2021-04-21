<template>
  <v-card min-height="500" class="d-flex flex-column justify-space-between">
    <v-card-title class="d-flex flex-column align-start">
      <span class="text-h4 grey--text text--darken-2">New entity</span>
      <span class="text-subtitle-2 grey--text text--lighten-1"
        >Description of the creation process</span
      >
    </v-card-title>
    <v-card-text>
      <v-swatches
        v-model="color"
        popover-x="right"
        swatches="basic"
        show-fallback
      />

      <v-form ref="entityForm">
        <v-text-field v-model="entityName" label="Entity name" class="my-2" />
        <v-text-field
          v-model="entityDescription"
          label="Entity Description"
          class="my-2"
        />
      </v-form>
    </v-card-text>
    <v-card-actions class="justify-end pa-4">
      <v-btn text class="success white--text mr-6" @click="onCreateClick"
        >Confirm</v-btn
      >
      <v-btn outlined color="error" @click="onCloseClick">Close</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue, Emit } from "vue-property-decorator";
import VSwatches from "vue-swatches";
import { entitiesModule, CreateEntityInput } from "@/store/modules/entities";
import { ValidationError } from "class-validator";

@Component({ components: { VSwatches } })
export default class CreateEntity extends Vue {
  @Emit()
  onCloseClick() {
    return;
  }
  async onCreateClick() {
    const entityInput = new CreateEntityInput();
    entityInput.color = this.color;
    entityInput.label = this.entityName;
    if (await entityInput.isValid()) {
      await entitiesModule.createEntity(entityInput);
    } else {
      console.log(await entityInput.errors());
      this.errors = await entityInput.errors();
    }
  }

  entityName = "";
  entityDescription = "";
  color = "#1CA085";
  errors: ValidationError[] = [];
  //color = "pouet";
}
</script>
