import { VuexModule, Module, Mutation } from "vuex-class-modules";
import store from "@/store/index";
import { Expose } from "class-transformer";

export class PaginationMeta {
  @Expose()
  result = 0;
  @Expose()
  total = 0;

  @Expose()
  pageIndex = 0;

  @Expose()
  pagesCount = 0;
  @Expose()
  pageSize = 0;

  get currentPage() {
    return this.pageIndex + 1;
  }
}

@Module
export class PaginationModule extends VuexModule {
  meta: PaginationMeta = new PaginationMeta();

  @Mutation
  setPaginationMeta(meta: PaginationMeta) {
    this.meta = meta;
  }
}

export const paginationModule = new PaginationModule({
  store,
  name: "pagination"
});
