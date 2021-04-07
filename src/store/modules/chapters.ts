import Vue from "vue";
import { VuexModule, Module, Action, Mutation } from "vuex-class-modules";
import store from "@/store/index";
import { Chapter } from "@/dtos/Chapter.dto";
import { DELETE_CHAPTER } from "@/api/chapters.query";
import apolloClient from "@/api/apollo.client";

@Module
export class ChaptersModule extends VuexModule {
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

export const chaptersModule = new ChaptersModule({ store, name: "chapters" });
