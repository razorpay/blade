/**
 * PT Serif font stack, with a size-adjusted Georgia fallback declared in `fonts.css`.
 *
 * Deliberately not a theme token (`theme.typography.fonts.family`): PT Serif is reserved for
 * `<Heading size="2xlarge" isSerif />` on the agentic dashboard, so consumers cannot reach it
 * outside the components that allow it. A typography component opts in by passing
 * `fontFamily="serif"` to `BaseText`. Today only `Heading` does; to extend serif to `Display`
 * or `Text` later, add the same `isSerif` prop there and pass `fontFamily="serif"`.
 *
 * Web only for now: on React Native, `BaseText` falls back to the heading font.
 */
export const SERIF_FONT_FAMILY = '"PT Serif", "PT Serif Fallback Georgia", Georgia, serif';
