import { Expose, Type } from "class-transformer";
import {
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  validate,
  ValidationError
} from "class-validator";
export class Coord {
  @Expose()
  paragraphIndex!: number;
  @Expose()
  wordIndex!: number;
}

export class CreateAnnotationInput {
  @Expose()
  @IsMongoId()
  @IsOptional()
  id?: string;
  @Expose()
  @IsMongoId()
  chapterId!: string;
  @Expose()
  @IsMongoId()
  projectId!: string;
  @Expose()
  @IsNotEmpty()
  @IsOptional()
  slug?: string;
  @Expose()
  @IsMongoId()
  @IsOptional()
  attributeId?: string;
  @Expose()
  @IsNotEmpty()
  value!: string;
  @Expose()
  @Type(() => Coord)
  start!: Coord;
  @Expose()
  @Type(() => Coord)
  end!: Coord;
  @IsMongoId()
  @Expose()
  entityId!: string;

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
