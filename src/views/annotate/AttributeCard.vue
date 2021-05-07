<template>
  <v-card width="300" v-if="attribute">
    <v-card-text class="py-0">
      <v-list two-line class="pb-0">
        <v-list-item class="px-0">
          <v-list-item-content>
            <v-list-item-title class="text-h6 align-center d-flex">
              <v-chip :color="attribute.entity.color" class="mr-2">
                {{ attribute.entity.label }}
              </v-chip>
              {{ attribute.slug }}
            </v-list-item-title>
            <v-list-item-subtitle class="mt-2">
              Created by
              <span class="primary--text font-weight-bold">{{
                createdBy ? createdBy.username : "Stabylo"
              }}</span>
              -
              <!--              {{ creationDate | dateFormat }}-->
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card-text>
    <v-card-actions class="d-flex justify-end">
      <v-btn icon @click.stop="onDeleteClick">
        <v-icon v-text="icons.Delete" />
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from "vue-property-decorator";
import { Annotation } from "@/dtos/Annotation.dto";
import { format, parseISO } from "date-fns";
import { Icons } from "@/components/core/icons/icons-names.enum";
import { Attribute } from "@/dtos/Attribute.dto";
import { User } from "@/dtos/User.dto";

@Component({
  filters: {
    dateFormat: (date: string) => {
      return !date ? "" : format(parseISO(date), "dd MMM yyyy p");
    }
  }
})
export default class AttributeCard extends Vue {
  icons = Icons;
  @Prop()
  attribute!: Attribute | null;
  @Prop()
  createdBy!: User | null;
  @Prop()
  annotationId?: string;

  @Emit()
  onDeleteClick() {
    return this.annotationId;
  }
}
</script>
