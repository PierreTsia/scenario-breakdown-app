import { Expose } from "class-transformer";

export class PaginatedDto {
  @Expose()
  readonly limit?: number;
  @Expose()
  readonly start: number = 0;
}
