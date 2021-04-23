import { classToClass, Expose } from "class-transformer";

export class Factory<T> {
  private readonly generatorFn: Function;

  constructor(fn: (options: never) => T) {
    this.generatorFn = fn;
  }

  @Expose()
  getSingleRecord(options = {}, override= {}): T {
    return classToClass({
      ...this.generatorFn(options),
      ...override
    });
  }

  @Expose()
  getArrayRecords(length: number, options = {}, overrides = []): T[] {
    return [...Array(length).keys()].map(i =>
      this.getSingleRecord(options, overrides[i])
    );
  }
}
