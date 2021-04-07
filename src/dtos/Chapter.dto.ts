import { Expose } from "class-transformer";

export class Chapter {
  @Expose()
  id?: string;
  @Expose()
  title: string | undefined;
}

export class RestChapter extends Chapter {
  @Expose({ name: "_id" })
  id?: string;
}
