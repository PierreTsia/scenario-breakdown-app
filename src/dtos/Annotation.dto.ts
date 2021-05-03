import { Expose, Type } from "class-transformer";
import { Chapter } from "@/dtos/Chapter.dto";
import { User } from "@/dtos/User.dto";
import { Attribute } from "@/dtos/Attribute.dto";
import { Coord } from "@/dtos/CreateAnnotationInput.dto";

export class DraftAnnotation {
  @Expose()
  @Type(() => Chapter)
  chapter!: Chapter;

  @Expose()
  start!: Coord;

  @Expose()
  end!: Coord;

  @Expose()
  @Type(() => User)
  createdBy!: User;

  @Expose()
  fullText?: string;
}
export class Annotation {
  @Expose()
  id!: string;
  @Expose()
  chapterId!: string;
  @Expose()
  projectId!: string;
  @Expose()
  value!: string;
  @Expose()
  @Type(() => Coord)
  start!: Coord;
  @Expose()
  @Type(() => Coord)
  end!: Coord;
  @Expose()
  @Type(() => Attribute)
  attribute!: Attribute;
  @Expose()
  @Type(() => User)
  createdBy!: User;
  @Expose()
  creationDate!: Date;
}
