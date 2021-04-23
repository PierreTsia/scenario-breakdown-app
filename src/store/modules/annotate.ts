import { Action, Module, Mutation, VuexModule } from "vuex-class-modules";
import store from "@/store/index";
import { Chapter } from "@/dtos/Chapter.dto";
import { Paragraph } from "@/dtos/Paragraph.dto";
import { plainToClass } from "class-transformer";
import { Word } from "@/dtos/Word.dto";
import {
  Annotation,
  AnnotationInput,
  DraftAnnotation
} from "@/dtos/Annotation.dto";
import apolloClient from "@/api/apollo.client";
import { CREATE_ANNOTATION, PROJECT_ANNOTATIONS } from "@/api/index.queries";

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
  editedAnnotation: DraftAnnotation | Annotation | null = null;
  annotations: Annotation[] = [];

  get isAnnotating(): boolean {
    return !!this.chapter;
  }

  get isCreatingAnnotation() {
    return !!this.editedAnnotation;
  }

  @Action
  async createAnnotation(input: AnnotationInput) {
    const { data } = await apolloClient.mutate({
      mutation: CREATE_ANNOTATION,
      variables: { input }
    });
    const newAnnotation = plainToClass(Annotation, data.annotate, {
      excludeExtraneousValues: true
    });
    this.addAnnotation(newAnnotation);
  }

  @Action
  async fetchAnnotations(projectId: string) {
    const { data } = await apolloClient.query({
      query: PROJECT_ANNOTATIONS,
      variables: { projectId }
    });
    this.setAnnotations(
      data.projectAnnotations.map((a: never) =>
        plainToClass(Annotation, a, {
          excludeExtraneousValues: true
        })
      )
    );
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

  @Mutation
  setAnnotations(annotations: Annotation[]) {
    this.annotations = annotations;
  }

  @Mutation
  addAnnotation(annotation: Annotation) {
    this.annotations = [
      annotation,
      ...this.annotations.filter(a => a?.id !== annotation.id)
    ];
  }

  @Mutation
  setDraftAnnotation(annotation: DraftAnnotation | null) {
    this.editedAnnotation = annotation;
  }
}

export const annotateModule = new AnnotateModule({ store, name: "annotate" });
