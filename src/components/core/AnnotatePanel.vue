<template>
  <v-bottom-sheet v-model="isShown" persistent>
    <v-sheet class="text-center grey darken-2" height="500px">
      <v-card flat class="d-flex flex-column justify-center" height="100%">
        <v-card-title>
          <v-spacer />
          <v-btn class="mt-1" text @click="onClose">
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
                  label="Extract"
                  disabled
                  :value="content"
                ></v-textarea>
              </v-col>
            </v-row>

            <v-row class="d-flex justify-center align-center">
              <v-col cols="5">
                <v-combobox
                  v-model="state.attribute"
                  :items="attributes"
                  hide-selected
                  :search-input.sync="search"
                  hint="...or type and press enter to create a new one"
                  label="Select attribute"
                  item-text="slug"
                  persistent-hint
                  small-chips
                >
                  <template v-slot:no-data>
                    <v-list-item>
                      <v-list-item-content>
                        <v-list-item-title>
                          No results matching "<strong>{{ search }}</strong
                          >". Press <kbd>enter</kbd> to create a new one
                        </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </template>
                </v-combobox>
              </v-col>
              <v-col cols="5">
                <v-autocomplete
                  v-model="state.entity"
                  :disabled="isExistingAttribute"
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
        <v-card-actions class="d-flex pb-xs-4">
          <v-row class="d-flex justify-center">
            <v-col cols="10">
              <v-btn
                class="mt-6"
                color="success"
                :disabled="!state.entity || !state.attribute"
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
import { attributesModule } from "@/store/modules/attributes";
import { Entity } from "@/dtos/Entity.dto";
import { plainToClass } from "class-transformer";
import { CreateAnnotationInput } from "@/dtos/CreateAnnotationInput.dto";
import { ValidationError } from "class-validator";
import { Attribute } from "@/dtos/Attribute.dto";

@Component
export default class AnnotatePanel extends OpenCloseMixin {
  icons = Icons;
  state: { entity: Entity | null; attribute: Attribute | null } = {
    entity: null,
    attribute: null
  };
  errors: ValidationError[] = [];
  search = null;
  @Watch("state", { deep: true })
  async onStateChange({ attribute }: { attribute: Attribute | null }) {
    if (attribute?.id) {
      this.state.entity = attribute.entity;
      this.$forceUpdate();
    }
  }
  async mounted() {
    await entitiesModule.fetchEntities();
    await attributesModule.fetchAttribute(this.$route.params.projectId);
  }

  async createAnnotation() {
    const { start, end, fullText } = annotateModule.editedAnnotation;

    const input = {
      chapterId: this.$route.params.chapterId,
      projectId: this.$route.params.projectId,
      value: fullText,
      start,
      end,
      entityId: this.state.entity?.id
    };
    if (this.state.attribute?.id) {
      input.attributeId = this.state.attribute.id;
    } else {
      input.slug = this.state.attribute;
    }

    const annotationInput = plainToClass(CreateAnnotationInput, input);
    console.log(annotationInput);
    const isValid = await annotationInput.isValid();
    const errors = await annotationInput.errors();
    if (!isValid) {
      this.errors = errors;
    } else {
      await annotateModule.createAnnotation(annotationInput);
      this.onClose();
    }
  }

  get content(): string {
    return annotateModule.editedAnnotation?.fullText ?? "";
  }

  get entities(): Entity[] {
    return entitiesModule.entities;
  }

  get attributes(): Attribute[] {
    return attributesModule.attributes;
  }

  get isExistingAttribute(): boolean {
    return !!this.state.attribute?.id;
  }
}
</script>
