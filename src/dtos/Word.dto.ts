import { Expose } from "class-transformer";

export class Word {
  @Expose()
  readonly paragraphId!: string;

  @Expose()
  readonly label!: string;

  @Expose()
  readonly paragraphIndex!: number;

  @Expose()
  readonly wordIndex!: number;

  get uniqId(): string {
    return `${this.paragraphIndex}-${this.wordIndex}`;
  }
}
