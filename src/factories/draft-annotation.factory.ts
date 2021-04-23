import first from "lodash/first";
import last from "lodash/last";
import { Word } from "@/dtos/Word.dto";
import { Expose, plainToClass } from "class-transformer";
import { Coord, DraftAnnotation } from "@/dtos/Annotation.dto";
import { Chapter } from "@/dtos/Chapter.dto";
import { User } from "@/dtos/User.dto";
import { Factory } from "@/factories/factory.factory";

type Boundary = "start" | `end`;
type Boundaries = { [key in Boundary]: Coord };

export class DraftAnnotationFactory extends Factory<DraftAnnotation> {
  words: Word[] = [];
  chapter!: Chapter;
  user!: User;

  constructor(annotationWords: Word[], chapter: Chapter, user: User) {
    super(props =>
      plainToClass(
        DraftAnnotation,
        { ...(props as object) },
        { excludeExtraneousValues: true }
      )
    );
    this.words = annotationWords;
    this.chapter = chapter;
    this.user = user;
  }
  get firstW() {
    return first(this.words)!;
  }

  get lastW() {
    return last(this.words)!;
  }

  @Expose()
  get fullText(): string {
    return this.words.map(w => w.label).join(" ");
  }

  get boundaries() {
    return { start: this.firstW, end: this.lastW };
  }

  getCoords() {
    return (["start", "end"] as Boundary[]).reduce(
      (acc, key: Boundary) => ({
        ...acc,
        [key]: {
          paragraphIndex: this.boundaries[key].paragraphIndex,
          wordIndex: this.boundaries[key].wordIndex
        }
      }),
      {} as Boundaries
    );
  }

  create() {
    return this.getSingleRecord({
      ...this,
      fullText: this.fullText,
      createdBy: this.user,
      ...this.getCoords()
    });
  }
}
