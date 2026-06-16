import type React from 'react';
import type { Theme } from '~components/BladeProvider';

type GetFocusRingArgs = {
  theme: Theme;
  negativeOffset?: boolean;
  isImportant?: boolean;
};

type FocusRingWrapperProps = {
  isFocused: boolean;
  /** Border radius of the wrapped element — the ring expands outward matching this curvature */
  borderRadius: number;
  /** When true the ring is suppressed (e.g. table input cells use a negative-offset ring instead) */
  disabled?: boolean;
  children: React.ReactNode;
};

export type { GetFocusRingArgs, FocusRingWrapperProps };
