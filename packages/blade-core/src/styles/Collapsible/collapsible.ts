import { cva } from 'class-variance-authority';
// @ts-expect-error - CSS modules may not have type definitions in build
import styles from './collapsible.module.css';

export const getCollapsibleTriggerClasses = cva(styles.trigger, {
  variants: {
    isDisabled: {
      true: null,
      false: null,
    },
  },
  defaultVariants: {
    isDisabled: false,
  },
});

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

export const getCollapsibleTemplateClasses = (): Record<string, string> => ({
  trigger: styles.trigger,
  triggerContent: styles.triggerContent,
  triggerIcon: styles.triggerIcon,
  triggerLabel: styles.triggerLabel,
  triggerChevron: styles.triggerChevron,
  chevronExpanded: styles.chevronExpanded,
  body: styles.body,
  bodyInner: styles.bodyInner,
});

export type CollapsibleTriggerVariants = {
  isDisabled?: boolean;
};

export type CollapsibleChevronVariants = {
  isExpanded?: boolean;
};
