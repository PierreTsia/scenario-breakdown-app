import { Component, Emit, PropSync, Vue } from "vue-property-decorator";
@Component
export default class OpenCloseMixin extends Vue {
  @PropSync("isOpened", { type: Boolean, required: true, default: false })
  isShown!: string;

  @Emit()
  onClose() {}
}
