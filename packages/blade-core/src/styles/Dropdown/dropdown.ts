import { cva } from 'class-variance-authority';
// @ts-expect-error - CSS modules may not have type definitions in build
import styles from './dropdown.module.css';

export type DropdownOverlayVariants = {
  isInBottomSheet?: boolean;
  isMenu?: boolean;
};

export type InputDropdownButtonSize = 'small' | 'medium' | 'large';

export type InputDropdownButtonVariants = {
  size?: InputDropdownButtonSize;
};

/**
 * Overlay surface classes. `isMenu` drives the flexible min/max width (input
 * triggers instead take the reference width applied inline by floating-ui's
 * `size` middleware); `isInBottomSheet` removes the box-shadow.
 */
export const dropdownOverlayStyles = cva(styles.overlaySurface, {
  variants: {
    isInBottomSheet: {
      true: styles.overlaySurfaceInBottomSheet,
      false: null,
    },
    isMenu: {
      true: styles.overlayMenuWidth,
      false: null,
    },
  },
  defaultVariants: {
    isInBottomSheet: false,
    isMenu: false,
  },
});

export function getDropdownOverlayClasses(props: DropdownOverlayVariants): string {
  return dropdownOverlayStyles(props);
}

/**
 * InputDropdownButton classes. `size` maps height / border-radius / inner
 * padding (mirrors `baseInputHeight`, `inputDropdownButtonBorderRadius`,
 * `inputDropdownButtonPadding`).
 */
export const inputDropdownButtonStyles = cva(styles.idButton, {
  variants: {
    size: {
      small: styles.idButtonSmall,
      medium: styles.idButtonMedium,
      large: styles.idButtonLarge,
    },
  },
  defaultVariants: {
    size: 'medium',
  },
});

export function getInputDropdownButtonClasses(props: InputDropdownButtonVariants): string {
  return inputDropdownButtonStyles(props);
}

export const dropdownFloatingClass = styles.floating;
export const dropdownTriggerWrapperClass = styles.triggerWrapper;
export const dropdownFooterClass = styles.footer;
export const inputDropdownButtonContentClass = styles.idButtonContent;

export const baseHeaderInnerClass = styles.headerInner;
export const baseHeaderRowClass = styles.headerRow;
export const baseHeaderTitleBlockClass = styles.headerTitleBlock;
export const baseHeaderLeadingClass = styles.headerLeading;
export const baseHeaderTitleRowClass = styles.headerTitleRow;
export const baseHeaderTrailingClass = styles.headerTrailing;
export const baseHeaderChildrenClass = styles.headerChildren;
export const baseFooterInnerClass = styles.footerInner;

/**
 * Structural/template classes. Call from Svelte components so class references
 * used only in compound selectors aren't tree-shaken.
 */
export function getDropdownTemplateClasses(): {
  floating: string;
  triggerWrapper: string;
  overlaySurface: string;
  overlaySurfaceInBottomSheet: string;
  overlayMenuWidth: string;
  idButton: string;
  idButtonContent: string;
  footer: string;
  headerInner: string;
  headerRow: string;
  headerTitleBlock: string;
  headerLeading: string;
  headerTitleRow: string;
  headerTrailing: string;
  headerChildren: string;
  footerInner: string;
} {
  return {
    floating: styles.floating,
    triggerWrapper: styles.triggerWrapper,
    overlaySurface: styles.overlaySurface,
    overlaySurfaceInBottomSheet: styles.overlaySurfaceInBottomSheet,
    overlayMenuWidth: styles.overlayMenuWidth,
    idButton: styles.idButton,
    idButtonContent: styles.idButtonContent,
    footer: styles.footer,
    headerInner: styles.headerInner,
    headerRow: styles.headerRow,
    headerTitleBlock: styles.headerTitleBlock,
    headerLeading: styles.headerLeading,
    headerTitleRow: styles.headerTitleRow,
    headerTrailing: styles.headerTrailing,
    headerChildren: styles.headerChildren,
    footerInner: styles.footerInner,
  };
}
