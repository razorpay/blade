import { cva } from 'class-variance-authority';
// @ts-expect-error - CSS modules may not have type definitions in build
import styles from './stepGroup.module.css';

export const stepGroupStyles = cva(styles.stepGroup, {
  variants: {
    size: {
      medium: null,
      large: styles.large,
    },
    orientation: {
      vertical: styles.vertical,
      horizontal: styles.horizontal,
    },
  },
  defaultVariants: {
    size: 'medium',
    orientation: 'vertical',
  },
});

export const stepItemStyles = cva(styles.stepItem, {
  variants: {
    orientation: {
      vertical: styles.stepItemVertical,
      horizontal: styles.stepItemHorizontal,
    },
  },
  defaultVariants: {
    orientation: 'vertical',
  },
});

export const interactiveHeaderStyles = cva(styles.interactiveHeader, {
  variants: {
    isSelected: {
      true: styles.interactiveHeaderSelected,
      false: null,
    },
  },
  defaultVariants: {
    isSelected: false,
  },
});

export const indicatorBackgroundStyles = cva(styles.indicatorBackground, {
  variants: {
    color: {
      primary: styles.indicatorPrimary,
      positive: styles.indicatorPositive,
      negative: styles.indicatorNegative,
      notice: styles.indicatorNotice,
      information: styles.indicatorInformation,
      neutral: styles.indicatorNeutral,
    },
  },
  defaultVariants: {
    color: 'neutral',
  },
});

export const indicatorDotStyles = cva(styles.indicatorDot, {
  variants: {
    size: {
      medium: styles.indicatorDotMedium,
      large: styles.indicatorDotLarge,
    },
    color: {
      primary: styles.indicatorDotColorPrimary,
      positive: styles.indicatorDotColorPositive,
      negative: styles.indicatorDotColorNegative,
      notice: styles.indicatorDotColorNotice,
      information: styles.indicatorDotColorInformation,
      neutral: styles.indicatorDotColorNeutral,
    },
  },
  defaultVariants: {
    size: 'medium',
    color: 'neutral',
  },
});

// Export nested class for nested StepGroup containers
export const nestedStepGroupClass = styles.nested;

// Named class exports for template use
export const stepItemContentClass = styles.stepItemContent;
export const stepItemChildrenClass = styles.stepItemChildren;
export const headerRowClass = styles.headerRow;
export const staticHeaderClass = styles.staticHeader;

// StepLine class exports
export const stepLineClass = styles.stepLine;
export const stepLineVerticalClass = styles.stepLineVertical;
export const stepLineHorizontalClass = styles.stepLineHorizontal;
export const straightLineVerticalClass = styles.straightLineVertical;
export const straightLineVerticalDottedClass = styles.straightLineVerticalDotted;
export const straightLineVerticalTopClass = styles.straightLineVerticalTop;
export const straightLineHorizontalClass = styles.straightLineHorizontal;
export const straightLineHorizontalDottedClass = styles.straightLineHorizontalDotted;
export const markerWrapperClass = styles.markerWrapper;
export const markerDefaultClass = styles.markerDefault;
export const markerIndentedClass = styles.markerIndented;
export const markerTopOffsetClass = styles.markerTopOffset;
export const lineIndentedClass = styles.lineIndented;
