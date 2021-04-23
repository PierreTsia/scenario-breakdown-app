import { Expose, Transform, Type } from "class-transformer";
import { Chapter } from "@/dtos/Chapter.dto";
import { Entity } from "@/dtos/Entity.dto";
import { User } from "@/dtos/User.dto";
import {
  IsNotEmpty,
  validate,
  ValidationError,
  IsObject,
  IsNotEmptyObject,
  IsMongoId
} from "class-validator";

export type Coord = { paragraphIndex: number; wordIndex: number };
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
export class AnnotationInput {
  @Expose()
  @IsNotEmpty()
  label!: string;

  @Expose()
  @IsMongoId()
  @Transform(({ value }) => value.id)
  entity!: string;

  @Expose()
  @IsMongoId()
  @Transform(({ value }) => value.id)
  chapter!: string;

  @Expose()
  start!: Coord;

  @Expose()
  end!: Coord;
}

export class Annotation extends DraftAnnotation {
  @Expose()
  id?: string;

  @Expose()
  @IsNotEmpty()
  label!: string;

  @Expose()
  @IsObject()
  @IsNotEmptyObject()
  @Type(() => Entity)
  entity!: Entity;

  @Expose()
  creationDate?: string;

  @Expose()
  async errors(): Promise<ValidationError[]> {
    return await validate(this);
  }

  @Expose()
  async isValid() {
    const errors = await this.errors();
    return !errors?.length;
  }
}
