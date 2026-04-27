import { cva } from 'class-variance-authority';
// @ts-expect-error - CSS modules may not have type definitions in build
import styles from './accordion.module.css';

export const getAccordionWrapperClasses = cva(styles.wrapper, {
  variants: {
    variant: {
      filled: styles.filled,
      transparent: styles.transparent,
    },
  },
  defaultVariants: {
    variant: 'transparent',
  },
});

export const getAccordionButtonClasses = cva(styles.button, {
  variants: {
    isExpanded: {
      true: styles.buttonExpanded,
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
    { variant: 'filled', isFirstItem: true, class: styles.filledFirstItem },
    { variant: 'filled', isLastItem: true, isExpanded: false, class: styles.filledLastItemCollapsed },
    {
      variant: 'filled',
      isFirstItem: true,
      isLastItem: true,
      isExpanded: false,
      class: styles.filledSingleItemCollapsed,
    },
    {
      variant: 'filled',
      isFirstItem: true,
      isLastItem: true,
      isExpanded: true,
      class: styles.filledSingleItemExpanded,
    },
  ],
});

export const getAccordionTemplateClasses = () => ({
  wrapper: styles.wrapper,
  filled: styles.filled,
  transparent: styles.transparent,
  button: styles.button,
  buttonExpanded: styles.buttonExpanded,
  filledFirstItem: styles.filledFirstItem,
  filledLastItemCollapsed: styles.filledLastItemCollapsed,
  filledSingleItemCollapsed: styles.filledSingleItemCollapsed,
  filledSingleItemExpanded: styles.filledSingleItemExpanded,
  headerContainer: styles.headerContainer,
  headerContent: styles.headerContent,
  headerContentMedium: styles.headerContentMedium,
  headerContentCentered: styles.headerContentCentered,
  headerLeading: styles.headerLeading,
  headerLeadingLarge: styles.headerLeadingLarge,
  headerLeadingMedium: styles.headerLeadingMedium,
  headerLeadingIcon: styles.headerLeadingIcon,
  headerLeadingSlot: styles.headerLeadingSlot,
  headerMain: styles.headerMain,
  headerTitleRow: styles.headerTitleRow,
  headerTitleText: styles.headerTitleText,
  headerTrailing: styles.headerTrailing,
  headerChevron: styles.headerChevron,
  chevronExpanded: styles.chevronExpanded,
  headerDivider: styles.headerDivider,
  collapsibleContent: styles.collapsibleContent,
  body: styles.body,
  accordionOuter: styles.accordionOuter,
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
