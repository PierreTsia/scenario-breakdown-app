import { Expose, Type } from "class-transformer";
import { Paragraph } from "@/dtos/Paragraph.dto";

export class Chapter {
  @Expose()
  id?: string;
  @Expose()
  title: string | undefined;
  @Expose()
  @Type(() => Paragraph)
  paragraphs: Paragraph[] = [];

  get paragraphCount(): number {
    return this.paragraphs?.length ?? 0;
  }
}

export class RestChapter extends Chapter {
  @Expose({ name: "_id" })
  id?: string;
}
