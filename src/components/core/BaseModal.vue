<template>
  <v-dialog
    v-model="dialog"
    transition="dialog-bottom-transition"
    max-width="800"
  >
    <component :is="activeDialog" @on-close-click="onClose" />
  </v-dialog>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue, Watch } from "vue-property-decorator";
import CreateEntity from "@/components/core/dialogs/CreateEntity.vue";
import { dialogModule } from "@/store/modules/dialog";

@Component({ components: { CreateEntity } })
export default class BaseModal extends Vue {
  @Prop({ required: true, default: false, type: Boolean }) isOpened!: boolean;

  @Watch("isOpened", { immediate: true })
  onPropsChanges(newState: boolean) {
    this.dialog = newState;
  }

  @Emit()
  onCloseModal() {
    return;
  }

  onClose() {
    return dialogModule.closeDialog();
  }
  dialog = false;
  activeDialog = "create-entity";
}
</script>
