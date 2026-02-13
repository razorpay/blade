import { cva } from 'class-variance-authority';
import { utilityClasses } from '../utilities';
// @ts-expect-error - CSS modules may not have type definitions in build
import styles from './card.module.css';

// --- CardRoot CVA ---

export type CardRootVariants = {
  borderRadius?: 'medium' | 'large' | 'xlarge';
  shouldScaleOnHover?: boolean;
  isPressed?: boolean;
  asLabel?: boolean;
};

export const cardRootStyles = cva(styles.cardRoot, {
  variants: {
    borderRadius: {
      medium: utilityClasses['border-radius-medium'],
      large: utilityClasses['border-radius-large'],
      xlarge: utilityClasses['border-radius-xlarge'],
    },
    shouldScaleOnHover: {
      true: styles.shouldScaleOnHover,
      false: '',
    },
    isPressed: {
      true: styles.cardRootPressed,
      false: '',
    },
    asLabel: {
      true: styles.cardRootLabel,
      false: '',
    },
  },
  defaultVariants: {
    borderRadius: 'medium',
    shouldScaleOnHover: false,
    isPressed: false,
    asLabel: false,
  },
});

// --- CardSurface CVA ---

export type CardSurfaceVariants = {
  elevation?: 'none' | 'lowRaised' | 'midRaised' | 'highRaised';
  backgroundColor?:
    | 'surface.background.gray.subtle'
    | 'surface.background.gray.moderate'
    | 'surface.background.gray.intense';
  padding?: 'spacing.0' | 'spacing.3' | 'spacing.4' | 'spacing.5' | 'spacing.7';
  borderRadius?: 'medium' | 'large' | 'xlarge';
};

export const cardSurfaceStyles = cva(styles.cardSurface, {
  variants: {
    elevation: {
      none: utilityClasses['elevation-none'],
      lowRaised: utilityClasses['elevation-lowRaised'],
      midRaised: utilityClasses['elevation-midRaised'],
      highRaised: utilityClasses['elevation-highRaised'],
    },
    backgroundColor: {
      'surface.background.gray.subtle': utilityClasses['background-surface-gray-subtle'],
      'surface.background.gray.moderate': utilityClasses['background-surface-gray-moderate'],
      'surface.background.gray.intense': utilityClasses['background-surface-gray-intense'],
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
    elevation: 'lowRaised',
    backgroundColor: 'surface.background.gray.intense',
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
