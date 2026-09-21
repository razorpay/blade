import { cva } from 'class-variance-authority';

export const getAccordionWrapperClasses = cva('w-full', {
  variants: {
    variant: {
      filled: 'blade-accordion-filled',
      transparent: 'bg-transparent',
    },
  },
  defaultVariants: {
    variant: 'transparent',
  },
});

export const getAccordionButtonClasses = cva('blade-accordion-button', {
  variants: {
    isExpanded: {
      true: 'text-interactive-icon-gray-subtle',
      false: null,
    },
    isDisabled: {
      true: null,
      false: null,
    },
  },
  defaultVariants: {
    isExpanded: false,
    isDisabled: false,
  },
});

/**
 * Hover/focus-visible border-radius compounds — plain Tailwind pseudo-variants (no plugin needed;
 * these are single-property radius overrides on the same element, unlike the button's stateful
 * background/color/divider rules which do need the `.blade-accordion-button` plugin class).
 */
export const getAccordionButtonBorderClasses = cva('', {
  variants: {
    variant: {
      filled: null,
      transparent: null,
    },
    isFirstItem: {
      true: null,
      false: null,
    },
    isLastItem: {
      true: null,
      false: null,
    },
    isExpanded: {
      true: null,
      false: null,
    },
  },
  compoundVariants: [
    {
      variant: 'filled',
      isFirstItem: true,
      class: 'hover:rounded-t-medium focus-visible:rounded-t-medium',
    },
    {
      variant: 'filled',
      isLastItem: true,
      isExpanded: false,
      class: 'hover:rounded-b-medium focus-visible:rounded-b-medium',
    },
    {
      variant: 'filled',
      isFirstItem: true,
      isLastItem: true,
      isExpanded: false,
      class: 'hover:rounded-medium focus-visible:rounded-medium',
    },
    {
      variant: 'filled',
      isFirstItem: true,
      isLastItem: true,
      isExpanded: true,
      class: 'hover:rounded-t-medium focus-visible:rounded-t-medium',
    },
  ],
});

export const getAccordionTemplateClasses = (): Record<string, string> => ({
  wrapper: 'w-full',
  filled: 'blade-accordion-filled',
  transparent: 'bg-transparent',
  button: 'blade-accordion-button',
  buttonExpanded: 'text-interactive-icon-gray-subtle',
  filledFirstItem: 'hover:rounded-t-medium focus-visible:rounded-t-medium',
  filledLastItemCollapsed: 'hover:rounded-b-medium focus-visible:rounded-b-medium',
  filledSingleItemCollapsed: 'hover:rounded-medium focus-visible:rounded-medium',
  filledSingleItemExpanded: 'hover:rounded-t-medium focus-visible:rounded-t-medium',
  headerContainer: 'flex-1 flex flex-col',
  headerContent: 'flex flex-row items-start px-spacing-5 my-spacing-5 [--header-slot-height:28px]',
  headerContentMedium: '[--header-slot-height:20px]',
  headerContentCentered: 'items-center',
  headerLeading: 'overflow-hidden shrink-0 flex items-center min-h-[var(--header-slot-height)]',
  headerLeadingLarge: 'max-h-[32px] max-w-[32px]',
  headerLeadingMedium: 'max-h-[24px] max-w-[24px]',
  headerLeadingIcon: 'mr-spacing-3',
  headerLeadingSlot: 'mr-spacing-3',
  headerMain: 'flex flex-col flex-1 min-w-0',
  headerTitleRow: 'flex flex-row items-center gap-spacing-3',
  headerTitleText: 'mt-[1px]',
  headerTrailing: 'flex items-center ml-spacing-4 shrink-0 min-h-[var(--header-slot-height)]',
  headerChevron: 'flex items-center shrink-0 ml-spacing-3 min-h-[var(--header-slot-height)]',
  headerDivider: 'px-spacing-0',
  collapsibleContentGray: 'bg-surface-background-gray-subtle',
  collapsibleContentGrayLast: 'rounded-b-medium',
  body: 'flex flex-col gap-spacing-5 mt-spacing-4 mb-spacing-5 mx-spacing-5',
  bodyGray: 'm-spacing-0 pt-spacing-4 pb-spacing-5 px-spacing-5',
  accordionOuter:
    'min-w-[200px] max-w-[calc(100vw_-_40px)] s:min-w-[360px] s:max-w-[640px] m:max-w-[800px]',
});

export type AccordionWrapperVariants = {
  variant?: 'filled' | 'transparent';
};

export type AccordionButtonVariants = {
  isExpanded?: boolean;
  isDisabled?: boolean;
};

export type AccordionButtonBorderVariants = {
  variant?: 'filled' | 'transparent';
  isFirstItem?: boolean;
  isLastItem?: boolean;
  isExpanded?: boolean;
};
