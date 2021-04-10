import { Expose } from "class-transformer";

export class Paragraph {
  @Expose()
  id?: string;
  @Expose()
  index?: number;
  @Expose()
  words: string[] = [];

  get wordsCount() {
    return this.words.length;
  }
}
