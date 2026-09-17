import { cva } from 'class-variance-authority';

/**
 * Animated chevron wrapper used by CollapsibleLink. Rotates 180deg when expanded.
 */
export const getCollapsibleChevronClasses = cva(
  'flex items-center origin-center transition-transform duration-moderate ease-standard',
  {
    variants: {
      isExpanded: {
        true: '-rotate-180',
        false: null,
      },
    },
    defaultVariants: {
      isExpanded: false,
    },
  },
);

/**
 * Animated body-content wrapper. Height + opacity are transitioned imperatively
 * via inline styles in the component; this class provides the transition config.
 * The `data-default-expanded='true'` SSR case (auto height / visible) is expressed as a
 * Tailwind data-attribute variant (was `.bodyContent[data-default-expanded='true']`).
 */
export const getCollapsibleBodyClasses = cva(
  'h-spacing-0 hidden opacity-80 overflow-y-hidden transition-[height,opacity] duration-moderate ease-standard data-[default-expanded=true]:h-auto data-[default-expanded=true]:block data-[default-expanded=true]:opacity-100',
);

/**
 * Text trigger wrapper used by `CollapsibleText`. Lays out the text + chevron in
 * a full-width row. The disabled appearance is driven by the `[disabled]`
 * attribute selector on the rendered `<button>` (project convention), so no
 * `isDisabled` variant is needed here.
 */
export const getCollapsibleTextClasses = cva(
  'flex flex-row items-center justify-between w-full m-spacing-0 p-spacing-0 border-none bg-transparent text-left cursor-pointer text-interactive-text-gray-subtle disabled:cursor-not-allowed disabled:opacity-40',
);

/**
 * Inner content margin wrapper for CollapsibleBody. Margin top/bottom depends on
 * `direction` and `hasMargin`. Encoded as CVA compoundVariants instead of
 * inline styles.
 */
export const getCollapsibleBodyInnerClasses = cva('block', {
  variants: {
    direction: {
      bottom: null,
      top: null,
    },
    hasMargin: {
      true: null,
      false: 'mt-spacing-0 mb-spacing-0',
    },
  },
  compoundVariants: [
    {
      direction: 'bottom',
      hasMargin: true,
      class: 'mt-spacing-4 mb-spacing-0',
    },
    {
      direction: 'top',
      hasMargin: true,
      class: 'mt-spacing-0 mb-spacing-4',
    },
  ],
  defaultVariants: {
    direction: 'bottom',
    hasMargin: true,
  },
});

/**
 * Inner flex wrapper for Collapsible. Replaces inline style for flex-direction
 * and min/max width restrictions — driven by `direction` and
 * `_shouldApplyWidthRestrictions` props.
 */
export const getCollapsibleInnerClasses = cva('flex items-start', {
  variants: {
    direction: {
      bottom: 'flex-col',
      top: 'flex-col-reverse',
    },
    shouldApplyWidthRestrictions: {
      true: 'min-w-[200px] max-w-[min(calc(100vw_-_var(--spacing-10)),1136px)]',
      false: 'min-w-0 max-w-none',
    },
  },
  defaultVariants: {
    direction: 'bottom',
    shouldApplyWidthRestrictions: true,
  },
});

export function getCollapsibleTemplateClasses(): Record<string, string> {
  return {
    triggerChevron: 'flex items-center origin-center transition-transform duration-moderate ease-standard',
    chevronExpanded: '-rotate-180',
    bodyContent:
      'h-spacing-0 hidden opacity-80 overflow-y-hidden transition-[height,opacity] duration-moderate ease-standard',
    bodyInner: 'block',
    inner: 'flex items-start',
    innerDirectionBottom: 'flex-col',
    innerDirectionTop: 'flex-col-reverse',
    innerWidthRestricted: 'min-w-[200px] max-w-[min(calc(100vw_-_var(--spacing-10)),1136px)]',
    innerWidthUnrestricted: 'min-w-0 max-w-none',
  };
}

export type CollapsibleChevronVariants = {
  isExpanded?: boolean;
};

export type CollapsibleInnerVariants = {
  direction?: 'bottom' | 'top';
  shouldApplyWidthRestrictions?: boolean;
};

export type CollapsibleBodyInnerVariants = {
  direction?: 'bottom' | 'top';
  hasMargin?: boolean;
};
