import { Expose } from "class-transformer";
import { Entity } from "@/dtos/Entity.dto";

export class Attribute {
  @Expose()
  id!: string;
  @Expose()
  slug!: string;
  @Expose()
  projectId!: string;
  @Expose()
  entity!: Entity;
}
