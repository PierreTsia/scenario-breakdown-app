import { Component, Prop, Vue } from "vue-property-decorator";
import { appModule } from "@/store/modules/app";

export enum Colors {
  Cyan = "#2e97a7",
  Purple = "#6c63ff",
  White = "#fff",
  Grey = "#BDBDBD"
}

@Component
export default class BaseAsset extends Vue {
  @Prop() height!: number;
  @Prop() width!: number;

  defaultHeight = 400;
  defaultWidth = 400;

  get dimensions() {
    return {
      width: this?.width ?? this.defaultWidth,
      height: this?.height ?? this.defaultHeight
    };
  }

  get isDark() {
    return appModule.isDark;
  }

  get mainColor() {
    return this.isDark ? Colors.Cyan : Colors.Purple;
  }

  get clearColor() {
    return this.isDark ? Colors.Grey : Colors.White;
  }
}
