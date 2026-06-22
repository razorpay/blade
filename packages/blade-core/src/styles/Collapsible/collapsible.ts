import { cva } from 'class-variance-authority';
// @ts-expect-error - CSS modules may not have type definitions in build
import styles from './collapsible.module.css';

/**
 * Animated chevron wrapper used by CollapsibleLink. Rotates 180deg when expanded.
 */
export const getCollapsibleChevronClasses = cva(styles.triggerChevron, {
  variants: {
    isExpanded: {
      true: styles.chevronExpanded,
      false: null,
    },
  },
  defaultVariants: {
    isExpanded: false,
  },
});

/**
 * Animated body-content wrapper. Height + opacity are transitioned imperatively
 * via inline styles in the component; this class provides the transition config.
 */
export const getCollapsibleBodyClasses = cva(styles.bodyContent);

/**
 * Text trigger wrapper used by `CollapsibleText`. Lays out the text + chevron in
 * a full-width row and dims itself when disabled.
 */
export const getCollapsibleTextClasses = cva(styles.trigger, {
  variants: {
    isDisabled: {
      true: styles.triggerDisabled,
      false: null,
    },
  },
  defaultVariants: {
    isDisabled: false,
  },
});

/**
 * Inner content margin wrapper for CollapsibleBody. Margin top/bottom depends on
 * `direction` and `hasMargin`. Encoded as CVA compoundVariants instead of
 * inline styles.
 */
export const getCollapsibleBodyInnerClasses = cva(styles.bodyInner, {
  variants: {
    direction: {
      bottom: null,
      top: null,
    },
    hasMargin: {
      true: null,
      false: styles.bodyInnerNoMargin,
    },
  },
  compoundVariants: [
    {
      direction: 'bottom',
      hasMargin: true,
      class: styles.bodyInnerMarginBottom,
    },
    {
      direction: 'top',
      hasMargin: true,
      class: styles.bodyInnerMarginTop,
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
export const getCollapsibleInnerClasses = cva(styles.inner, {
  variants: {
    direction: {
      bottom: styles.innerDirectionBottom,
      top: styles.innerDirectionTop,
    },
    shouldApplyWidthRestrictions: {
      true: styles.innerWidthRestricted,
      false: styles.innerWidthUnrestricted,
    },
  },
  defaultVariants: {
    direction: 'bottom',
    shouldApplyWidthRestrictions: true,
  },
});

export const getCollapsibleTemplateClasses = (): Record<string, string> => ({
  triggerChevron: styles.triggerChevron,
  chevronExpanded: styles.chevronExpanded,
  bodyContent: styles.bodyContent,
  bodyInner: styles.bodyInner,
  inner: styles.inner,
  innerDirectionBottom: styles.innerDirectionBottom,
  innerDirectionTop: styles.innerDirectionTop,
  innerWidthRestricted: styles.innerWidthRestricted,
  innerWidthUnrestricted: styles.innerWidthUnrestricted,
});

export type CollapsibleChevronVariants = {
  isExpanded?: boolean;
};

export type CollapsibleTextVariants = {
  isDisabled?: boolean;
};

export type CollapsibleInnerVariants = {
  direction?: 'bottom' | 'top';
  shouldApplyWidthRestrictions?: boolean;
};

export type CollapsibleBodyInnerVariants = {
  direction?: 'bottom' | 'top';
  hasMargin?: boolean;
};
