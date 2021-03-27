import { Expose } from "class-transformer";

export class Chapter {
  @Expose()
  id?: string;
  @Expose()
  title: string | undefined;
}
