<template>
  <v-dialog
    v-model="isShown"
    transition="dialog-bottom-transition"
    max-width="800"
  >
    <component :is="activeDialog" @on-close="onClose" />
  </v-dialog>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";
import CreateEntity from "@/components/core/dialogs/CreateEntity.vue";
import OpenCloseMixin from "@/components/mixins/OpenClose.mixin";

@Component({ components: { CreateEntity } })
export default class BaseModal extends OpenCloseMixin {
  activeDialog = "create-entity";
}
</script>
