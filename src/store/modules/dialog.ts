import { Module, Mutation, VuexModule } from "vuex-class-modules";
import store from "@/store/index";

export enum DialogName {
  CreateEntity = "create-entity"
}

@Module
export class Dialog extends VuexModule {
  activeDialog: DialogName | null = null;

  get isOpened(): boolean {
    return !!this.activeDialog;
  }

  @Mutation
  setActiveDialog({ name }: { name: DialogName | null }) {
    this.activeDialog = name;
  }

  @Mutation
  closeDialog() {
    this.activeDialog = null;
  }
}

export const dialogModule = new Dialog({ store, name: "dialog" });
