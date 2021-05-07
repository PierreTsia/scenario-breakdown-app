import { Action, Module, Mutation, VuexModule } from "vuex-class-modules";
import store from "@/store/index";
import { Chapter } from "@/dtos/Chapter.dto";
import { Paragraph, Token } from "@/dtos/Paragraph.dto";
import { plainToClass } from "class-transformer";
import { Word } from "@/dtos/Word.dto";
import { Annotation, DraftAnnotation } from "@/dtos/Annotation.dto";
import apolloClient from "@/api/apollo.client";
import {
  CREATE_ANNOTATION,
  DELETE_ANNOTATIONS,
  PROJECT_ANNOTATIONS
} from "@/api/index.queries";
import { CreateAnnotationInput } from "@/dtos/CreateAnnotationInput.dto";

const toClass = (input: any): Word => plainToClass(Word, input);

const serializeTokens = ({ tokens, id, index }: Paragraph) => {
  const { words } = tokens.reduce(
    (acc, token, tokenIndex) => {
      if (!token?.originalSeq) {
        acc.words.push(
          toClass({
            ...token,
            paragraphId: id!,
            wordIndex: acc.offset + tokenIndex,
            paragraphIndex: index!
          })
        );
      } else {
        const words = token.originalSeq.map((word, sequenceWordIndex) => {
          return toClass({
            value: word,
            paragraphId: id!,
            wordIndex: acc.offset + tokenIndex + sequenceWordIndex,
            paragraphIndex: index!,
            tag: token?.tag,
            uid: token?.uid,
            entityType: token?.entityType
          });
        });
        acc.words = [...acc.words, ...words];
        acc.offset += words.length - 1;
      }
      return acc;
    },
    { offset: 0, words: [] as Word[] }
  );
  return words;
};

const mapWords = (
  acc: Map<number, Word[]>,
  p: Paragraph
): Map<number, Word[]> => {
  return acc.set(
    p.index!,
    /* TODO 🛠 refact map function to get originalSeq if is tagged by NER*/
    serializeTokens(p)
  );
};

@Module
export class AnnotateModule extends VuexModule {
  chapter: Chapter | null = null;
  paragraphs: Paragraph[] = [];
  wordsByParagraphs: Map<number, Word[]> = new Map();
  paragraphsFullText: string[] = [];
  editedAnnotation: DraftAnnotation | null = null;
  annotations: Annotation[] = [];

  get isAnnotating(): boolean {
    return !!this.chapter;
  }

  get isCreatingAnnotation() {
    return !!this.editedAnnotation;
  }

  @Action
  async createAnnotation(input: CreateAnnotationInput) {
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
    if (data?.deleteAnnotations) {
      this.removeAnnotations({ annotationIds });
    }
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
  removeAnnotations({ annotationIds }: { annotationIds: string[] }) {
    this.annotations = this.annotations.filter(
      a => !annotationIds.includes(a.id)
    );
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
