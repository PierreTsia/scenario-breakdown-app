import { VuexModule, Module, Mutation } from "vuex-class-modules";
import store from "@/store/index";
import { Chapter } from "@/dtos/Chapter.dto";

@Module
export class Annotate extends VuexModule {
  chapter: Chapter | null = null;

  get isAnnotating(): boolean {
    return !!this.chapter;
  }

  @Mutation
  setAnnotatedChapter({ chapter }: { chapter: Chapter }) {
    this.chapter = chapter;
  }
}

export const annotateModule = new Annotate({ store, name: "annotate" });
