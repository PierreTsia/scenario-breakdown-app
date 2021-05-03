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
import {
  CREATE_ANNOTATION,
  DELETE_ANNOTATIONS,
  PROJECT_ANNOTATIONS
} from "@/api/index.queries";

const mapWords = (
  acc: Map<number, Word[]>,
  p: Paragraph
): Map<number, Word[]> => {
  return acc.set(
    p.index!,
    p.tokens.map((t, i) =>
      plainToClass(Word, {
        ...t,
        paragraphIndex: p.index,
        paragraphId: p.id,
        wordIndex: i
      })
    )
  );
};

@Module
export class AnnotateModule extends VuexModule {
  chapter: Chapter | null = null;
  paragraphs: Paragraph[] = [];
  wordsByParagraphs: Map<number, Word[]> = new Map();
  paragraphsFullText: string[] = [];
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
  async deleteAnnotation({ annotationIds }: { annotationIds: string[] }) {
    const { data } = await apolloClient.mutate({
      mutation: DELETE_ANNOTATIONS,
      variables: { deleteInput: { annotationIds } }
    });
    /* TODO */
    console.log(data);
  }

  @Action
  async fetchAnnotations(input: { projectId: string; chapterId?: string }) {
    const { data } = await apolloClient.query({
      query: PROJECT_ANNOTATIONS,
      variables: { input }
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
  setParagraphs({ paragraphs }: { paragraphs: Paragraph[] }) {
    this.wordsByParagraphs = paragraphs.reduce(
      mapWords,
      new Map() as Map<number, Word[]>
    );
    this.paragraphsFullText = paragraphs.flatMap(p => p.fullText);
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
