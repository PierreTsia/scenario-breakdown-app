import { Expose, Transform, TransformFnParams, Type } from "class-transformer";
import { Chapter } from "@/dtos/Chapter.dto";
import { User } from "@/dtos/User.dto";

export enum Status {
  Uploaded = "UPLOADED",
  Parsed = "PARSED",
  Analyzed = "ANALYZED"
}

export class Project {
  @Expose()
  id?: string;

  @Expose()
  title?: string;

  @Expose()
  description?: string;

  @Expose()
  status!: Status;

  @Expose()
  @Type(() => Chapter)
  chapters: Chapter[] = [];

  @Expose()
  @Type(() => User)
  createdBy?: User;

  @Expose()
  creationDate?: Date;

  get chaptersCount() {
    return this.chapters.length;
  }
}

export class RestProject extends Project {
  @Expose({ name: "_id" })
  id?: string;
}
