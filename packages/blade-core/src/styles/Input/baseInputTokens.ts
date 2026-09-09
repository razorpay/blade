/**
 * Token maps ported from React `Input/BaseInput/baseInputTokens.ts` (web subset).
 *
 * These are consumed by the `baseInput` CVA to pick the right CSS-module class
 * per `size` / `validationState`. Interaction states (hover/focus/disabled) are
 * handled by CSS pseudo-classes (`:hover`, `:focus-within`, `[disabled]`) in
 * `baseInput.module.css`, so the React `currentInteraction` state machine and
 * the borderless/table/counter maps are intentionally dropped.
 */

export type BaseInputSize = 'xsmall' | 'small' | 'medium' | 'large';
export type BaseInputValidationState = 'none' | 'error' | 'success';
export type BaseInputValueComponentType = 'text' | 'heading';

/**
 * Input heights per size (px). xsmall 28 / small 32 / medium 36 / large 48.
 */
export const baseInputHeight: Record<BaseInputSize, number> = {
  xsmall: 28,
  small: 32,
  medium: 36,
  large: 48,
};

/**
 * Wrapper border-radius token per size. xsmall/small/medium → `small` (8px),
 * large → `medium` (12px).
 */
export const baseInputBorderRadius: Record<BaseInputSize, 'small' | 'medium'> = {
  xsmall: 'small',
  small: 'small',
  medium: 'small',
  large: 'medium',
};

/**
 * Padding tokens (spacing scale index) per side/size. Consumed as
 * `var(--spacing-N)` in the CSS module.
 */
export const baseInputPaddingTokens = {
  top: { xsmall: 2, small: 2, medium: 3, large: 4 },
  bottom: { xsmall: 2, small: 2, medium: 3, large: 4 },
  left: { xsmall: 3, small: 3, medium: 4, large: 4 },
  right: { xsmall: 3, small: 3, medium: 4, large: 4 },
} as const;

/**
 * `margin-left` (px) applied to the FormHint row when the label is
 * left-positioned, so the hint aligns under the input rather than the label.
 */
export const formHintLeftLabelMarginLeft: Record<BaseInputSize, number> = {
  xsmall: 136,
  small: 136,
  medium: 136,
  large: 192,
};
