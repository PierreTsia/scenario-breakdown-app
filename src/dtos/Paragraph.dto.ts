import { Expose } from "class-transformer";

export class Paragraph {
  @Expose()
  id?: string;
  @Expose()
  index?: number;
  @Expose()
  tokens: Token[] = [];
  @Expose()
  fullText!: string[];

  get wordsCount() {
    return this.tokens.filter(t => t.tag === "word")?.length;
  }
}

export class Token {
  @Expose()
  value!: string;
  @Expose()
  tag!: string;
  @Expose()
  entityType?: string;
  @Expose()
  uid?: string;
  @Expose()
  originalSeq?: string[];
}
