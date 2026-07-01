import { cva } from 'class-variance-authority';
import { utilityClasses } from '../utilities';
// @ts-expect-error - CSS modules may not have type definitions in build
import styles from './card.module.css';

// --- CardRoot CVA ---

export type CardRootVariants = {
  borderRadius?: 'medium' | 'large' | 'xlarge';
  asLabel?: boolean;
};

export const cardRootStyles = cva(styles.cardRoot, {
  variants: {
    borderRadius: {
      medium: utilityClasses['border-radius-medium'],
      large: utilityClasses['border-radius-large'],
      xlarge: utilityClasses['border-radius-xlarge'],
    },
    asLabel: {
      true: styles.cardRootLabel,
      false: '',
    },
  },
  defaultVariants: {
    borderRadius: 'medium',
    asLabel: false,
  },
});

// --- CardSurface CVA ---

export type CardGrayBackgroundColor =
  | 'surface.background.gray.subtle'
  | 'surface.background.gray.moderate'
  | 'surface.background.gray.intense';

/** Colored surface tokens available only on `theme-card`. */
export type CardThemeBackgroundColor =
  | 'surface.background.primary.subtle'
  | 'surface.background.primary.intense'
  | 'surface.background.sea.subtle'
  | 'surface.background.sea.intense'
  | 'surface.background.cloud.subtle'
  | 'surface.background.cloud.intense';

export type CardBackgroundColor = CardGrayBackgroundColor | CardThemeBackgroundColor;

/**
 * Visual treatment of the Card surface.
 *
 * - `primary-card`: elevated styling (gradients, drop shadow) with
 *   `surface.background.gray.intense` background.
 * - `secondary-card`: flat styling with `surface.background.gray.moderate` background.
 * - `theme-card`: primary-card elevation (white bottom inset lip, drop shadow)
 *   with black 2% top/bottom gradients and configurable backgroundColor.
 */
export type CardType = 'primary-card' | 'secondary-card' | 'theme-card';

/**
 * Resolves the effective surface background color for a given Card `type`.
 *
 * `primary-card` and `secondary-card` own their background and ignore the
 * `backgroundColor` prop. `theme-card` defers to the configurable
 * `backgroundColor` (defaulting to intense when unset).
 */
export const getCardBackgroundColor = (
  type: CardType,
  backgroundColor?: CardBackgroundColor,
): CardBackgroundColor => {
  switch (type) {
    case 'secondary-card':
      return 'surface.background.gray.moderate';
    case 'theme-card':
      return backgroundColor ?? 'surface.background.gray.intense';
    case 'primary-card':
    default:
      return 'surface.background.gray.intense';
  }
};

export type CardSurfaceVariants = {
  type?: CardType;
  backgroundColor?: CardBackgroundColor;
  padding?: 'spacing.0' | 'spacing.3' | 'spacing.4' | 'spacing.5' | 'spacing.7';
  borderRadius?: 'medium' | 'large' | 'xlarge';
};

// `type` selects elevated (primary-card, theme-card) vs flat (secondary-card)
// surface treatment in card.module.css. The deprecated `elevation` prop on
// <Card> is a no-op for API parity with React's Card.
export const cardSurfaceStyles = cva(styles.cardSurface, {
  variants: {
    type: {
      'primary-card': styles.cardSurfaceElevated,
      'secondary-card': styles.cardSurfaceFlat,
      'theme-card': styles.cardSurfaceThemed,
    },
    backgroundColor: {
      'surface.background.gray.subtle': utilityClasses['background-surface-gray-subtle'],
      'surface.background.gray.moderate': utilityClasses['background-surface-gray-moderate'],
      'surface.background.gray.intense': utilityClasses['background-surface-gray-intense'],
      'surface.background.primary.subtle':
        utilityClasses['background-surface-background-primary-subtle'],
      'surface.background.primary.intense':
        utilityClasses['background-surface-background-primary-intense'],
      'surface.background.sea.subtle': utilityClasses['background-surface-background-sea-subtle'],
      'surface.background.sea.intense': utilityClasses['background-surface-background-sea-intense'],
      'surface.background.cloud.subtle':
        utilityClasses['background-surface-background-cloud-subtle'],
      'surface.background.cloud.intense':
        utilityClasses['background-surface-background-cloud-intense'],
    },
    padding: {
      'spacing.0': utilityClasses['padding-spacing-0'],
      'spacing.3': utilityClasses['padding-spacing-3'],
      'spacing.4': utilityClasses['padding-spacing-4'],
      'spacing.5': utilityClasses['padding-spacing-5'],
      'spacing.7': utilityClasses['padding-spacing-7'],
    },
    borderRadius: {
      medium: utilityClasses['border-radius-medium'],
      large: utilityClasses['border-radius-large'],
      xlarge: utilityClasses['border-radius-xlarge'],
    },
  },
  defaultVariants: {
    type: 'primary-card',
    padding: 'spacing.7',
    borderRadius: 'medium',
  },
});

// --- CardHeader ---

export type CardHeaderVariants = {
  paddingBottom?: 'spacing.0' | 'spacing.3' | 'spacing.4' | 'spacing.5' | 'spacing.7';
  marginBottom?: 'spacing.0' | 'spacing.3' | 'spacing.4' | 'spacing.5' | 'spacing.7';
};

const cardHeaderWrapperStyles = cva(styles.cardHeader, {
  variants: {
    marginBottom: {
      'spacing.0': utilityClasses['margin-bottom-spacing-0'],
      'spacing.3': utilityClasses['margin-bottom-spacing-3'],
      'spacing.4': utilityClasses['margin-bottom-spacing-4'],
      'spacing.5': utilityClasses['margin-bottom-spacing-5'],
      'spacing.7': utilityClasses['margin-bottom-spacing-7'],
    },
  },
  defaultVariants: {
    marginBottom: 'spacing.4',
  },
});

const cardHeaderContentStyles = cva(styles.cardHeaderContent, {
  variants: {
    paddingBottom: {
      'spacing.0': utilityClasses['padding-bottom-spacing-0'],
      'spacing.3': utilityClasses['padding-bottom-spacing-3'],
      'spacing.4': utilityClasses['padding-bottom-spacing-4'],
      'spacing.5': utilityClasses['padding-bottom-spacing-5'],
      'spacing.7': utilityClasses['padding-bottom-spacing-7'],
    },
  },
  defaultVariants: {
    paddingBottom: 'spacing.4',
  },
});

export function getCardHeaderClasses(
  props: CardHeaderVariants,
): {
  wrapper: string;
  content: string;
} {
  return {
    wrapper: cardHeaderWrapperStyles({ marginBottom: props.marginBottom }),
    content: cardHeaderContentStyles({ paddingBottom: props.paddingBottom }),
  };
}

// --- CardFooter ---

export type CardFooterVariants = {
  paddingTop?: 'spacing.0' | 'spacing.3' | 'spacing.4' | 'spacing.5' | 'spacing.7';
  marginTop?: 'spacing.0' | 'spacing.3' | 'spacing.4' | 'spacing.5' | 'spacing.7';
  justifyEnd?: boolean;
};

const cardFooterWrapperStyles = cva(styles.cardFooter, {
  variants: {
    marginTop: {
      'spacing.0': utilityClasses['margin-top-spacing-0'],
      'spacing.3': utilityClasses['margin-top-spacing-3'],
      'spacing.4': utilityClasses['margin-top-spacing-4'],
      'spacing.5': utilityClasses['margin-top-spacing-5'],
      'spacing.7': utilityClasses['margin-top-spacing-7'],
    },
  },
  defaultVariants: {
    marginTop: 'spacing.4',
  },
});

const cardFooterContentStyles = cva(styles.cardFooterContent, {
  variants: {
    paddingTop: {
      'spacing.0': utilityClasses['padding-top-spacing-0'],
      'spacing.3': utilityClasses['padding-top-spacing-3'],
      'spacing.4': utilityClasses['padding-top-spacing-4'],
      'spacing.5': utilityClasses['padding-top-spacing-5'],
      'spacing.7': utilityClasses['padding-top-spacing-7'],
    },
    justifyEnd: {
      true: styles.cardFooterContentEnd,
      false: '',
    },
  },
  defaultVariants: {
    paddingTop: 'spacing.4',
    justifyEnd: false,
  },
});

export function getCardFooterClasses(
  props: CardFooterVariants,
): {
  wrapper: string;
  content: string;
} {
  return {
    wrapper: cardFooterWrapperStyles({ marginTop: props.marginTop }),
    content: cardFooterContentStyles({
      paddingTop: props.paddingTop,
      justifyEnd: props.justifyEnd,
    }),
  };
}

/**
 * Get template classes to prevent Svelte tree-shaking.
 * Call this function in component script blocks.
 */
export function getCardTemplateClasses(): Record<string, string> {
  return {
    cardRoot: styles.cardRoot,
    cardSurface: styles.cardSurface,
    cardSurfaceElevated: styles.cardSurfaceElevated,
    cardSurfaceThemed: styles.cardSurfaceThemed,
    cardSurfaceFlat: styles.cardSurfaceFlat,
    linkOverlay: styles.linkOverlay,
    cardHeaderLeading: styles.cardHeaderLeading,
    cardHeaderLeadingRow: styles.cardHeaderLeadingRow,
    cardHeaderLeadingPrefix: styles.cardHeaderLeadingPrefix,
    cardHeaderLeadingTitleWrap: styles.cardHeaderLeadingTitleWrap,
    cardHeaderLeadingTitleRow: styles.cardHeaderLeadingTitleRow,
    cardHeaderLeadingSuffix: styles.cardHeaderLeadingSuffix,
    cardHeaderTrailing: styles.cardHeaderTrailing,
    cardBody: styles.cardBody,
    cardFooterLeading: styles.cardFooterLeading,
    cardFooterTrailing: styles.cardFooterTrailing,
    cardFooterActionWrapper: styles.cardFooterActionWrapper,
    cardFooterActionSpacer: styles.cardFooterActionSpacer,
    cardHeaderIconButtonWrapper: styles.cardHeaderIconButtonWrapper,
  };
}
