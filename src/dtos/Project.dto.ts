import { Expose, Transform, TransformFnParams, Type } from "class-transformer";
import { Chapter } from "@/dtos/Chapter.dto";
import { User } from "@/dtos/User.dto";
import format from "date-fns/format";

const transformDate = ({ obj }: TransformFnParams): string =>
  format(new Date(+obj.creationDate), "dd MMMM yyyy");

export class Project {
  @Expose()
  id?: string;

  @Expose()
  title?: string;

  @Expose()
  description?: string;

  @Expose()
  @Type(() => Chapter)
  chapters: Chapter[] = [];

  @Expose()
  @Type(() => User)
  createdBy?: User;

  @Expose()
  @Type(() => Date)
  @Transform(transformDate, {
    toClassOnly: true
  })
  creationDate?: string;

  @Expose()
  get chaptersCount() {
    return this.chapters.length;
  }
}
