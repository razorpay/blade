import type React from 'react';
import type { TestID } from '~utils/types';

/**
 * Where the outgoing content leaves, and where the incoming content arrives from.
 *
 * `none` cross-fades in place. That is what non-numeric content gets, since there is no
 * meaningful "up" between two pieces of text.
 */
type AnimatedValueDirection = 'up' | 'down' | 'none';

type BaseAnimatedValueProps = {
  /**
   * Identifies the current content, and decides which way it travels.
   *
   * A change animates the swap; re-rendering the same value does nothing. Two values that
   * both read as finite numbers travel by their difference, and anything else cross-fades.
   *
   * Keep this the raw value rather than the formatted one. A formatted string like `"₹1,200"`
   * does not read as a number, so it would cross-fade instead of moving in the right
   * direction. Pass the number here and the formatted string as `children`.
   */
  value: string | number;

  /**
   * What to render for `value`. Defaults to the value itself, so the plain case needs no
   * children.
   */
  children?: React.ReactNode;

  /** Overrides the direction derived from `value`. */
  direction?: AnimatedValueDirection;
} & TestID;

export type { BaseAnimatedValueProps, AnimatedValueDirection };
