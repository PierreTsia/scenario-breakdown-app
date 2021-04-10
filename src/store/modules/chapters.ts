import {
  VuexModule,
  Module,
  Action,
  Mutation,
  RegisterOptions
} from "vuex-class-modules";
import store from "@/store/index";
import { Chapter } from "@/dtos/Chapter.dto";
import { CHAPTER_PARAGRAPHS, DELETE_CHAPTER } from "@/api/chapters.query";
import apolloClient from "@/api/apollo.client";
import {
  PaginationMeta,
  PaginationModule,
  paginationModule
} from "@/store/modules/pagination";
import { plainToClass } from "class-transformer";
import { Paragraph } from "@/dtos/Paragraph.dto";
import { annotateModule, AnnotateModule } from "@/store/modules/annotate";
import { PaginatedDto } from "@/dtos/Paginated.dto";

class ParagraphsInputDto extends PaginatedDto {
  readonly chapterId!: string;
}

@Module
export class ChaptersModule extends VuexModule {
  private paginationModule: PaginationModule;
  private annotateModule: AnnotateModule;

  constructor(
    paginationModule: PaginationModule,
    annotateModule: AnnotateModule,
    opts: RegisterOptions
  ) {
    super(opts);
    this.annotateModule = annotateModule;
    this.paginationModule = paginationModule;
  }
  chapters: Chapter[] = [];

  @Mutation
  setChapters({ chapters }: { chapters: Chapter[] }) {
    this.chapters = chapters;
  }

  @Mutation
  removeChapter({ chapterId }: { chapterId: string }) {
    const index = this.chapters.findIndex(({ id }) => id === chapterId);
    if (index !== -1) {
      this.chapters.splice(index, 1);
    }
  }

  @Action
  async getChapterParagraphs(chapterParagraphsInput: ParagraphsInputDto) {
    const { data } = await apolloClient.query({
      query: CHAPTER_PARAGRAPHS,
      variables: { chapterParagraphsInput }
    });
    const { meta, results } = data.chapterParagraphs;
    const paginationMeta: PaginationMeta = plainToClass(PaginationMeta, meta, {
      excludeExtraneousValues: true
    });
    const paragraphs: Paragraph[] = results.map((p: never) =>
      plainToClass(Paragraph, p, { excludeExtraneousValues: true })
    );
    this.paginationModule.setPaginationMeta(paginationMeta);
    this.annotateModule.setParagraphs(paragraphs);
  }

  @Action
  async deleteChapter({ chapterId }: { chapterId: string }) {
    try {
      const { data } = await apolloClient.mutate({
        mutation: DELETE_CHAPTER,
        variables: { chapterId }
      });
      if (data?.deleteChapter?.id) {
        this.removeChapter({ chapterId: data?.deleteChapter?.id });
      }
    } catch (e) {
      console.error(e);
    }
  }
}

export const chaptersModule = new ChaptersModule(
  paginationModule,
  annotateModule,
  {
    store,
    name: "chapters"
  }
);
