import { Expose, Type } from "class-transformer";

class ProjectInput {
  @Expose()
  title?: string;
  @Expose()
  description?: string;
}

export class CreateProjectDto {
  @Expose()
  @Type(() => ProjectInput)
  projectInput?: ProjectInput;
}
