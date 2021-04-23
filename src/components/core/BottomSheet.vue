<template>
  <v-bottom-sheet v-model="isShown" persistent>
    <v-sheet class="text-center grey darken-2" height="500px">
      <v-card
        flat
        class="grey darken-2 d-flex flex-column justify-center"
        height="100%"
      >
        <v-card-title>
          <v-spacer />
          <v-btn class="mt-1" text color="white" @click="onClose">
            <v-icon v-text="icons.Close" />
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-form>
            <v-row class="d-flex justify-center">
              <v-col cols="10">
                <v-textarea
                  outlined
                  name="input-7-4"
                  label="Outlined textarea"
                  :value="content"
                ></v-textarea>
              </v-col>
            </v-row>

            <v-row class="d-flex justify-center">
              <v-col cols="12" md="5">
                <v-text-field
                  ref="label"
                  v-model="state.label"
                  prepend-icon="mdi-badge-account"
                  label="label"
                  required
              /></v-col>
              <v-col cols="12" md="5">
                <v-autocomplete
                  v-model="state.entity"
                  :items="entities"
                  item-text="label"
                  return-object
                  id="entity-picker"
                  chips
                  small-chips
                  label="Entities"
                >
                  <template #selection="{ item }">
                    <v-chip :color="item.color">{{ item.label }}</v-chip>
                  </template>
                </v-autocomplete>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions class="d-flex justify-end">
          <v-row class="d-flex justify-center">
            <v-col cols="10">
              <v-btn
                class="mt-6"
                color="success"
                :disabled="!!errors.length"
                @click="createAnnotation"
                x-large
              >
                <v-icon v-text="icons.Save" class="mr-2" />
                Confirm
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-sheet>
  </v-bottom-sheet>
</template>
<script lang="ts">
import { Component, Watch } from "vue-property-decorator";
import { Icons } from "@/components/core/icons/icons-names.enum";
import OpenCloseMixin from "@/components/mixins/OpenClose.mixin";
import { annotateModule } from "@/store/modules/annotate";
import { entitiesModule } from "@/store/modules/entities";
import { Entity } from "@/dtos/Entity.dto";
import { plainToClass } from "class-transformer";
import { Annotation, AnnotationInput } from "@/dtos/Annotation.dto";
import { ValidationError } from "class-validator";

@Component
export default class BottomSheet extends OpenCloseMixin {
  icons = Icons;
  state: { label: string; entity: Entity | null } = { label: "", entity: null };
  errors: ValidationError[] = [];
  annotation: Annotation | null = null;
  @Watch("state", { deep: true, immediate: true })
  async onStateChange(state: { label: string; entity: Entity | null }) {
    const annotation: Annotation = plainToClass(Annotation, {
      ...state,
      ...annotateModule.editedAnnotation
    });
    const isValid = await annotation.isValid();
    if (isValid) {
      this.annotation = annotation;
      this.errors = [];
    } else {
      this.errors = await annotation.errors();
    }
  }
  @Watch("entities", { immediate: true })
  async onEntitiesChange(ent?: Entity[]) {
    if (!ent?.length) {
      await entitiesModule.fetchEntities();
    }
  }

  async createAnnotation() {
    const input = plainToClass(AnnotationInput, this.annotation, {
      excludeExtraneousValues: true
    });
    await annotateModule.createAnnotation(input);
    this.onClose();
  }

  get content(): string {
    return annotateModule.editedAnnotation?.fullText ?? "";
  }

  get entities(): Entity[] {
    return entitiesModule.entities;
  }
}
</script>
