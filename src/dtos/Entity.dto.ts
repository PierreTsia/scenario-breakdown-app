import { Exclude, Expose, Type } from "class-transformer";
import {
  IsHexColor,
  IsMongoId,
  IsNotEmpty,
  validate,
  ValidationError
} from "class-validator";
import { Project } from "@/dtos/Project.dto";

export class CreateEntityInput {
  @IsHexColor()
  @Expose()
  color!: string;

  @IsNotEmpty()
  @Expose()
  label!: string;

  @IsNotEmpty()
  @Expose()
  description!: string;

  @IsMongoId()
  @Expose()
  projectId!: string;

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

export class Entity {
  @Expose()
  readonly id!: string;

  @Expose()
  label!: string;

  @Exclude()
  @Type(() => Project)
  project!: Project;

  @Expose()
  color!: string;
}
