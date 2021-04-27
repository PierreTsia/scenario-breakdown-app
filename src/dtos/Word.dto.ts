import { Expose } from "class-transformer";
import { Token } from "@/dtos/Paragraph.dto";

export class Word extends Token {
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
