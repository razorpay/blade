/**
 * PT Serif font stack, with a size-adjusted Georgia fallback declared in `fonts.css`.
 *
 * Deliberately not a theme token (`theme.typography.fonts.family`): PT Serif is reserved for
 * `<Heading variant="serif" />` on the agentic dashboard, so consumers cannot reach it
 * outside the components that allow it. A typography component opts in by passing
 * `fontFamily="serif"` to `BaseText`. Today only `Heading` does, through `variant="serif"`.
 * `Display` has no `variant` prop yet, so it could take the same `serif` variant. `Text` already
 * uses `variant` for `body` / `caption`, so serif there would need a separate prop.
 *
 * Web only for now: on React Native, `BaseText` falls back to the heading font.
 */
export const SERIF_FONT_FAMILY = '"PT Serif", "PT Serif Fallback Georgia", Georgia, serif';
