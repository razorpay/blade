import type React from 'react';
import type { Theme } from '~components/BladeProvider';

/**
 * Mirrors the variants of the BaseFocusRing component set in Figma. `neutral` is for neutral
 * components, which a primary blue ring would give an accent they do not otherwise carry.
 */
type FocusRingVariant = 'primary' | 'neutral';

type GetFocusRingArgs = {
  theme: Theme;
  negativeOffset?: boolean;
  isImportant?: boolean;
  variant?: FocusRingVariant;
  /**
   * Set to `false` to leave out the `outline-width` transition, for components that already
   * declare their own `transition` and would lose it when the ring styles are spread in.
   *
   * @default true
   */
  withTransition?: boolean;
};

type FocusRingWrapperProps = {
  isFocused: boolean;
  /** Border radius of the wrapped element — the ring expands outward matching this curvature */
  borderRadius: number;
  /** When true the ring is suppressed (e.g. table input cells use a negative-offset ring instead) */
  disabled?: boolean;
  variant?: FocusRingVariant;
  children: React.ReactNode;
};

export type { GetFocusRingArgs, FocusRingWrapperProps, FocusRingVariant };
