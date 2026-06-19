import { cva } from 'class-variance-authority';
// @ts-expect-error - CSS modules may not have type definitions in build
import styles from './appBar.module.css';

// --- AppBar root CVA ---

export type AppBarVariants = {
  variant?: 'neutral' | 'subtle';
};

/**
 * Resolves the AppBar root classes.
 *
 * `variant` is the only style that depends on a single prop:
 * - `neutral` → static-black surface + static-white foreground (forced "dark" look)
 * - `subtle`  → gray surface that adapts to the page background
 *
 * Sticky/position is applied via a `data-sticky` attribute on the element (driven
 * by the `isSticky` prop) rather than a CVA variant, mirroring how React toggles
 * `position`/`top` from the prop.
 */
export const appBarStyles = cva(styles.appBar, {
  variants: {
    variant: {
      neutral: styles.appBarNeutral,
      subtle: styles.appBarSubtle,
    },
  },
  defaultVariants: {
    variant: 'neutral',
  },
});

export const getAppBarClasses = (props: AppBarVariants): string => {
  return appBarStyles({ variant: props.variant });
};

/**
 * Get template classes to prevent Svelte tree-shaking.
 * Call this function in component script blocks that use these structural classes.
 */
export function getAppBarTemplateClasses(): Record<string, string> {
  return {
    appBar: styles.appBar,
    appBarBackButton: styles.appBarBackButton,
    appBarLeading: styles.appBarLeading,
    appBarLeadingPrefix: styles.appBarLeadingPrefix,
    appBarLeadingLogo: styles.appBarLeadingLogo,
    appBarLeadingTitleWrap: styles.appBarLeadingTitleWrap,
    appBarLeadingTitleRow: styles.appBarLeadingTitleRow,
    appBarLeadingTitleSuffix: styles.appBarLeadingTitleSuffix,
    appBarRtbPill: styles.appBarRtbPill,
    appBarRtbShield: styles.appBarRtbShield,
    appBarActions: styles.appBarActions,
  };
}
