import { cva } from 'class-variance-authority';

// --- AppBar root CVA ---

export type AppBarVariants = {
  variant?: 'neutral' | 'subtle';
};

// Root: two-column grid (leading 1fr, actions auto), 64px min-height, spacing.3 vertical padding,
// spacing.5 → spacing.6 horizontal padding on desktop (screen `m` = 768px), sticky/relative driven
// by the `data-sticky` attribute. Both variants render a transparent surface (foreground colors are
// applied to Text/Icon by the components), so the variant classes are identical.
export const appBarStyles = cva(
  'grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-spacing-3 w-full min-h-[64px] box-border py-spacing-3 px-spacing-5 m:px-spacing-6 z-[100] data-[sticky=true]:sticky data-[sticky=true]:top-spacing-0 data-[sticky=false]:relative',
  {
    variants: {
      variant: {
        neutral: 'bg-transparent',
        subtle: 'bg-transparent',
      },
    },
    defaultVariants: {
      variant: 'neutral',
    },
  },
);

export const getAppBarClasses = (props: AppBarVariants): string => {
  return appBarStyles({ variant: props.variant });
};

/**
 * Get template classes to prevent Svelte tree-shaking.
 * Call this function in component script blocks that use these structural classes.
 */
export function getAppBarTemplateClasses(): Record<string, string> {
  return {
    appBar:
      'grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-spacing-3 w-full min-h-[64px] box-border py-spacing-3 px-spacing-5 m:px-spacing-6 z-[100]',
    appBarLeadingRow: 'flex flex-row items-center min-w-0 w-full',
    appBarBackButton: 'flex items-center shrink-0 mr-spacing-4',
    appBarLeading: 'flex flex-row items-center gap-spacing-3 min-w-0 flex-[1_1_0]',
    appBarLeadingLogo: 'flex items-center shrink-0 min-w-0 max-w-full blade-appbar-logo',
    appBarLeadingLogoStack: 'flex flex-col items-start shrink-0 min-w-0 max-w-full',
    appBarLeadingTitleWrap: 'flex flex-col flex-[1_1_0] min-w-0 overflow-hidden',
    appBarLeadingTitleRow: 'flex flex-row items-center gap-spacing-3 min-w-0 w-full',
    appBarLeadingTitleRowWithIconBadge: 'w-fit max-w-full blade-appbar-title-row-icon-badge',
    appBarLeadingTitle: 'flex items-center min-w-0 overflow-hidden blade-appbar-title',
    appBarLeadingBadge: 'flex items-center mt-spacing-1 min-w-0 max-w-full',
    appBarActions: 'flex flex-row items-center gap-spacing-3 shrink-0 ml-auto',
  };
}
