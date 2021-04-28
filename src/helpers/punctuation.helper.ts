export type Punct =
  | ","
  | ":"
  | ";"
  | `"`
  | "."
  | "-"
  | "'"
  | "?"
  | "!"
  | "«"
  | "("
  | ")"
  | "»";
type Pattern = [number, number, number, number];

export class PunctuationHelper {
  private readonly space_all: Pattern = [0, 5, 0, 5];
  private readonly no_space: Pattern = [0, -10, 0, -10];
  private readonly space_right: Pattern = [0, 5, 0, -10];
  private readonly space_left: Pattern = [0, -10, 0, 5];

  private readonly punctuationPatterns: Map<Punct, Pattern> = new Map([
    [",", this.space_right],
    [".", this.space_right],
    [":", this.space_all],
    ["?", this.space_all],
    ["!", this.space_all],
    ["(", this.space_left],
    [")", this.space_right],
    ["«", this.space_left],
    ["»", this.space_right],
    [";", this.space_all],
    ["-", this.no_space],
    [`"`, this.no_space],
    ["'", this.no_space]
  ]);

  private generateMargins(patt: Pattern): string {
    return patt.map(n => `${n}px`).join(" ");
  }
  spacePunctuationWord(p: Punct): string {
    const patt = this.punctuationPatterns.get(p) ?? this.no_space;
    return this.generateMargins(patt);
  }
}
