import type { Snippet } from 'svelte';
import type { FormSize, FormLabelPosition, FormHintType } from '@razorpay/blade-core/styles';

export type NecessityIndicator = 'required' | 'optional' | 'none';

export interface FormLabelProps {
  /** Renders as a `<label>` (associated to an input) or a `<span>`. */
  as?: 'span' | 'label';
  /** Label position. `left` is desktop-only in React; here it always applies. */
  position?: FormLabelPosition;
  /** Necessity indicator shown after the label text. */
  necessityIndicator?: NecessityIndicator;
  /** Label text (string) or a snippet. */
  children: Snippet | string | undefined;
  /** Id of the label element (for `aria-labelledby`). */
  id?: string;
  /** `for` attribute — id of the associated input (only with `as="label"`). */
  htmlFor?: string;
  /** Label size. @default 'medium' */
  size?: FormSize;
  /** Suffix element rendered right after the label text (e.g. an info tooltip). */
  labelSuffix?: Snippet;
  /** Trailing element rendered at the end of the label row (e.g. a Link). */
  labelTrailing?: Snippet;
}

export interface FormHintProps {
  /** Which hint to render. */
  type: FormHintType;
  /** Help text (rendered when no error/success takes precedence). */
  helpText?: string;
  /** Error text (rendered when `type` is `error`). */
  errorText?: string;
  /** Success text (rendered when `type` is `success`). */
  successText?: string;
  /** Id set on the help text (accessibility). */
  helpTextId?: string;
  /** Id set on the error text (accessibility). */
  errorTextId?: string;
  /** Id set on the success text (accessibility). */
  successTextId?: string;
  /** Hint size. @default 'medium' */
  size?: FormSize;
}

export interface CharacterCounterProps {
  /** Current character count. */
  currentCount: number;
  /** Maximum character count. */
  maxCount: number;
  /** Counter size. @default 'medium' */
  size?: FormSize;
}
