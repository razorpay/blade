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

export const getCollapsibleTemplateClasses = (): Record<string, string> => ({
  triggerChevron: styles.triggerChevron,
  chevronExpanded: styles.chevronExpanded,
  bodyContent: styles.bodyContent,
  bodyInner: styles.bodyInner,
});

export type CollapsibleChevronVariants = {
  isExpanded?: boolean;
};

export type CollapsibleTextVariants = {
  isDisabled?: boolean;
};
