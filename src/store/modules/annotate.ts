import { Module, Mutation, VuexModule } from "vuex-class-modules";
import store from "@/store/index";
import { Chapter } from "@/dtos/Chapter.dto";
import { Paragraph } from "@/dtos/Paragraph.dto";

@Module
export class AnnotateModule extends VuexModule {
  chapter: Chapter | null = null;
  paragraphs: Paragraph[] = [];
  wordsByParagraphs: Map<number, any> = new Map();

  get isAnnotating(): boolean {
    return !!this.chapter;
  }

  @Mutation
  setAnnotatedChapter({ chapter }: { chapter: Chapter | null }) {
    this.chapter = chapter;
  }
  @Mutation
  setParagraphs(paragraphs: Paragraph[]) {
    this.paragraphs = paragraphs;
    this.wordsByParagraphs = paragraphs.reduce((acc, p) => {
      return acc.set(p.index as number, p.words);
    }, this.wordsByParagraphs);
  }
}

export const annotateModule = new AnnotateModule({ store, name: "annotate" });
