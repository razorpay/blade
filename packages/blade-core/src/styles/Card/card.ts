import { cva } from 'class-variance-authority';

// --- CardRoot CVA ---

export type CardRootVariants = {
  borderRadius?: 'medium' | 'large' | 'xlarge';
  asLabel?: boolean;
};

/**
 * `.blade-card-root` (plugin) owns the `[data-selected]`/`[data-focused]`/`[data-validation]`
 * box-shadow compounds and the descendant rule uplifting nested interactive elements above the
 * link overlay. Border radius stays atomic.
 */
export const cardRootStyles = cva('blade-card-root', {
  variants: {
    borderRadius: {
      medium: 'rounded-medium',
      large: 'rounded-large',
      xlarge: 'rounded-xlarge',
    },
    asLabel: {
      true: 'cursor-pointer',
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

/** Colored surface tokens available only on `theme` variant. */
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
 * - `primary`: elevated styling (gradients, drop shadow) with
 *   `surface.background.gray.intense` background.
 * - `secondary`: flat styling with `surface.background.gray.moderate` background.
 * - `theme`: primary elevation (white bottom inset lip, drop shadow)
 *   with black 2% top/bottom gradients and configurable backgroundColor.
 */
export type CardType = 'primary' | 'secondary' | 'theme';

/**
 * Resolves the effective surface background color for a given Card `type`.
 *
 * `primary` and `secondary` own their background and ignore the
 * `backgroundColor` prop. `theme` defers to the configurable
 * `backgroundColor` (defaulting to primary subtle when unset).
 */
export const getCardBackgroundColor = (
  type: CardType,
  backgroundColor?: CardBackgroundColor,
): CardBackgroundColor => {
  switch (type) {
    case 'secondary':
      return 'surface.background.gray.moderate';
    case 'theme':
      return backgroundColor ?? 'surface.background.primary.subtle';
    case 'primary':
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

// `type` selects elevated (primary, theme) vs flat (secondary) surface treatment; the elevated/theme
// gradients + dark-mode swap + "hide border when selected" override live in the plugin.
export const cardSurfaceStyles = cva('w-full flex relative flex-col box-border text-left', {
  variants: {
    type: {
      primary: 'blade-card-surface-elevated',
      secondary: 'border-none shadow-none bg-none',
      theme: 'blade-card-surface-themed',
    },
    backgroundColor: {
      'surface.background.gray.subtle': 'bg-surface-background-gray-subtle',
      'surface.background.gray.moderate': 'bg-surface-background-gray-moderate',
      'surface.background.gray.intense': 'bg-surface-background-gray-intense',
      'surface.background.primary.subtle': 'bg-surface-background-primary-subtle',
      'surface.background.primary.intense': 'bg-surface-background-primary-intense',
      'surface.background.sea.subtle': 'bg-surface-background-sea-subtle',
      'surface.background.sea.intense': 'bg-surface-background-sea-intense',
      'surface.background.cloud.subtle': 'bg-surface-background-cloud-subtle',
      'surface.background.cloud.intense': 'bg-surface-background-cloud-intense',
    },
    padding: {
      'spacing.0': 'p-spacing-0',
      'spacing.3': 'p-spacing-3',
      'spacing.4': 'p-spacing-4',
      'spacing.5': 'p-spacing-5',
      'spacing.7': 'p-spacing-7',
    },
    borderRadius: {
      medium: 'rounded-medium',
      large: 'rounded-large',
      xlarge: 'rounded-xlarge',
    },
  },
  defaultVariants: {
    type: 'primary',
    padding: 'spacing.7',
    borderRadius: 'medium',
  },
});

const CARD_SURFACE_BACKGROUND_COLOR_KEYS: readonly CardBackgroundColor[] = [
  'surface.background.gray.subtle',
  'surface.background.gray.moderate',
  'surface.background.gray.intense',
  'surface.background.primary.subtle',
  'surface.background.primary.intense',
  'surface.background.sea.subtle',
  'surface.background.sea.intense',
  'surface.background.cloud.subtle',
  'surface.background.cloud.intense',
];

export const CARD_SURFACE_BACKGROUND_UTILITY: Record<CardBackgroundColor, string> = {
  'surface.background.gray.subtle': 'bg-surface-background-gray-subtle',
  'surface.background.gray.moderate': 'bg-surface-background-gray-moderate',
  'surface.background.gray.intense': 'bg-surface-background-gray-intense',
  'surface.background.primary.subtle': 'bg-surface-background-primary-subtle',
  'surface.background.primary.intense': 'bg-surface-background-primary-intense',
  'surface.background.sea.subtle': 'bg-surface-background-sea-subtle',
  'surface.background.sea.intense': 'bg-surface-background-sea-intense',
  'surface.background.cloud.subtle': 'bg-surface-background-cloud-subtle',
  'surface.background.cloud.intense': 'bg-surface-background-cloud-intense',
};

export function getCardSurfaceBackgroundUtilityClass(backgroundColor: CardBackgroundColor): string {
  return CARD_SURFACE_BACKGROUND_UTILITY[backgroundColor];
}

export function isCardBackgroundColor(value: string): value is CardBackgroundColor {
  return (CARD_SURFACE_BACKGROUND_COLOR_KEYS as readonly string[]).includes(value);
}

/**
 * Pulls a {@link CardBackgroundColor} token out of a space-separated class string.
 */
export function extractCardBackgroundColorFromClassNames(
  classNames: string | undefined,
): {
  backgroundColor?: CardBackgroundColor;
  remainingClassNames?: string;
} {
  const trimmed = classNames?.trim();
  if (!trimmed) {
    return {};
  }

  const tokens = trimmed.split(/\s+/);
  const backgroundColor = tokens.find(isCardBackgroundColor);

  if (!backgroundColor) {
    return { remainingClassNames: trimmed };
  }

  const remainingClassNames = tokens.filter((token) => token !== backgroundColor).join(' ');

  return {
    backgroundColor,
    remainingClassNames: remainingClassNames || undefined,
  };
}

export type GetCardSurfaceClassesParams = {
  type?: CardType;
  backgroundColor?: CardBackgroundColor;
  padding?: CardSurfaceVariants['padding'];
  borderRadius?: CardSurfaceVariants['borderRadius'];
};

/** Surface class list for {@link CardSurface}: CVA layout, type, and token background utilities. */
export function getCardSurfaceClasses({
  type = 'primary',
  backgroundColor,
  padding = 'spacing.7',
  borderRadius = 'medium',
}: GetCardSurfaceClassesParams): string {
  return cardSurfaceStyles({
    type,
    backgroundColor: getCardBackgroundColor(type, backgroundColor),
    padding,
    borderRadius,
  });
}

// --- CardHeader ---

export type CardHeaderVariants = {
  paddingBottom?: 'spacing.0' | 'spacing.3' | 'spacing.4' | 'spacing.5' | 'spacing.7';
  marginBottom?: 'spacing.0' | 'spacing.3' | 'spacing.4' | 'spacing.5' | 'spacing.7';
};

const cardHeaderWrapperStyles = cva('', {
  variants: {
    marginBottom: {
      'spacing.0': 'mb-spacing-0',
      'spacing.3': 'mb-spacing-3',
      'spacing.4': 'mb-spacing-4',
      'spacing.5': 'mb-spacing-5',
      'spacing.7': 'mb-spacing-7',
    },
  },
  defaultVariants: {
    marginBottom: 'spacing.4',
  },
});

const cardHeaderContentStyles = cva('flex flex-row justify-between', {
  variants: {
    paddingBottom: {
      'spacing.0': 'pb-spacing-0',
      'spacing.3': 'pb-spacing-3',
      'spacing.4': 'pb-spacing-4',
      'spacing.5': 'pb-spacing-5',
      'spacing.7': 'pb-spacing-7',
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

const cardFooterWrapperStyles = cva('', {
  variants: {
    marginTop: {
      'spacing.0': 'mt-spacing-0',
      'spacing.3': 'mt-spacing-3',
      'spacing.4': 'mt-spacing-4',
      'spacing.5': 'mt-spacing-5',
      'spacing.7': 'mt-spacing-7',
    },
  },
  defaultVariants: {
    marginTop: 'spacing.4',
  },
});

// `max-m:` targets the same <768px range as the original `@media (max-width: 768px)`.
const cardFooterContentStyles = cva(
  'flex flex-row justify-between items-center max-m:flex-col max-m:items-stretch',
  {
    variants: {
      paddingTop: {
        'spacing.0': 'pt-spacing-0',
        'spacing.3': 'pt-spacing-3',
        'spacing.4': 'pt-spacing-4',
        'spacing.5': 'pt-spacing-5',
        'spacing.7': 'pt-spacing-7',
      },
      justifyEnd: {
        true: 'justify-end',
        false: '',
      },
    },
    defaultVariants: {
      paddingTop: 'spacing.4',
      justifyEnd: false,
    },
  },
);

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
    cardRoot: 'blade-card-root',
    cardSurface: 'w-full flex relative flex-col box-border text-left',
    cardSurfaceElevated: 'blade-card-surface-elevated',
    cardSurfaceThemed: 'blade-card-surface-themed',
    cardSurfaceFlat: 'border-none shadow-none bg-none',
    cardTicketWrapper: 'relative flex flex-col w-full',
    cardTicketOutline: 'absolute inset-0 w-full h-full z-[1] pointer-events-none overflow-visible',
    cardTicketClipContent: 'relative z-0 flex flex-col w-full',
    cardTicketSection: 'relative box-border p-spacing-4',
    cardTicketSectionTop: 'bg-surface-background-gray-intense',
    cardTicketSectionBottom:
      'bg-surface-background-gray-moderate bg-[radial-gradient(circle_4px_at_8px_0px,var(--surface-background-gray-intense)_3.5px,transparent_4px)] bg-repeat-x bg-[length:16px_100%] bg-left-top',
    cardInfoWrapper:
      "relative flex flex-col w-full overflow-hidden border-solid border-thin border-surface-border-gray-subtle rounded-medium data-[selected=true]:border-surface-border-primary-normal data-[disabled=true]:border-dashed",
    cardInfoSectionTop: 'bg-surface-background-gray-intense p-spacing-4',
    cardInfoSectionBottom: 'bg-surface-background-gray-moderate p-spacing-4',
    linkOverlay: 'blade-card-link-overlay',
    cardHeaderLeading: 'flex flex-col gap-spacing-4',
    cardHeaderLeadingRow: 'flex-1 flex flex-row',
    cardHeaderLeadingPrefix: 'mr-spacing-3 self-center flex',
    cardHeaderLeadingTitleWrap: 'mr-spacing-5',
    cardHeaderLeadingTitleRow: 'flex flex-row items-center flex-wrap',
    cardHeaderLeadingSuffix: 'ml-spacing-3',
    cardHeaderTrailing: 'self-center',
    cardBody: '',
    cardFooterLeading: 'text-left',
    cardFooterTrailing:
      'flex flex-row self-center ml-spacing-5 max-m:self-auto max-m:mt-spacing-5 max-m:ml-spacing-0',
    cardFooterActionWrapper: 'flex-1',
    cardFooterActionSpacer: 'ml-spacing-5',
    cardHeaderIconButtonWrapper: 'w-[28px]',
  };
}
