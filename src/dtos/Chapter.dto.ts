import { Expose, Type } from "class-transformer";
import { Paragraph } from "@/dtos/Paragraph.dto";
import { Status } from "@/dtos/Project.dto";

export class Chapter {
  @Expose()
  id?: string;
  @Expose()
  title: string | undefined;
  @Expose()
  @Type(() => Paragraph)
  paragraphs: Paragraph[] = [];
  @Expose()
  status!: Status;

  get paragraphCount(): number {
    return this.paragraphs?.length ?? 0;
  }
}

export class RestChapter extends Chapter {
  @Expose({ name: "_id" })
  id?: string;
}
