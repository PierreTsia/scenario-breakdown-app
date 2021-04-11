import { Module, Mutation, VuexModule } from "vuex-class-modules";
import store from "@/store/index";
import { Chapter } from "@/dtos/Chapter.dto";
import { Paragraph } from "@/dtos/Paragraph.dto";
import { Expose, plainToClass } from "class-transformer";

export class Word {
  @Expose()
  readonly paragraphId!: string;

  @Expose()
  readonly label!: string;

  @Expose()
  readonly paragraphIndex!: number;

  @Expose()
  readonly wordIndex!: number;

  get uniqId(): string {
    return `${this.paragraphIndex}-${this.wordIndex}`;
  }
}
const mapWords = (
  acc: Map<number, Word[]>,
  p: Paragraph
): Map<number, Word[]> => {
  return acc.set(
    p.index!,
    p.words.map((w, i) =>
      plainToClass(
        Word,
        {
          label: w,
          paragraphIndex: p.index,
          paragraphId: p.id,
          wordIndex: i
        },
        { excludeExtraneousValues: true }
      )
    )
  );
};

@Module
export class AnnotateModule extends VuexModule {
  chapter: Chapter | null = null;
  paragraphs: Paragraph[] = [];
  wordsByParagraphs: Map<number, Word[]> = new Map();

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
    this.wordsByParagraphs = paragraphs.reduce(
      mapWords,
      this.wordsByParagraphs
    );
  }
}

export const annotateModule = new AnnotateModule({ store, name: "annotate" });
