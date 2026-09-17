import { cva } from 'class-variance-authority';
// @ts-expect-error - CSS modules may not have type definitions in build
import styles from './modal.module.css';

/**
 * Default z-index for the Modal. Mirrors React's `componentZIndices.modal`.
 * Exposed alongside the CVA like `BOTTOM_SHEET_Z_INDEX`.
 */
export const MODAL_Z_INDEX = 1000;

export type ModalSize = 'small' | 'medium' | 'large' | 'full';
export type ModalBodyPadding = 'spacing.0' | 'spacing.6';

/**
 * CVA wrapper for the Modal surface. `size` selects the max-width (and, for
 * `full`, switches from the centered model to a fixed inset). The open/closed
 * animation is handled in CSS via the `data-state` attribute.
 */
export const getModalSurfaceClasses = cva(styles.surface, {
  variants: {
    size: {
      small: styles.sizeSmall,
      medium: styles.sizeMedium,
      large: styles.sizeLarge,
      full: styles.sizeFull,
    },
  },
  defaultVariants: {
    size: 'small',
  },
});

/**
 * CVA wrapper for the Modal body. `padding` toggles between the default
 * `spacing.6` and `spacing.0`; `hasHeight` applies an explicit height fed via
 * the `--modal-body-height` CSS variable.
 */
export const getModalBodyClasses = cva(styles.body, {
  variants: {
    padding: {
      'spacing.0': styles.bodyPaddingZero,
      'spacing.6': styles.bodyPaddingDefault,
    },
    hasHeight: {
      true: styles.bodyHasHeight,
      false: null,
    },
  },
  defaultVariants: {
    padding: 'spacing.6',
    hasHeight: false,
  },
});

/* Structural class names — exported individually so Svelte templates can
 * reference them and the bundler keeps them. Calling
 * `getModalTemplateClasses()` from the component anchors them against
 * tree-shaking (CSS modules export ESM objects whose unused members are
 * otherwise dropped). */
export const modalWrapperClass = styles.wrapper;
export const modalBackdropClass = styles.backdrop;
export const modalHeaderClass = styles.header;
export const modalEmptyHeaderCapsuleClass = styles.emptyHeaderCapsule;
export const modalHeaderContentClass = styles.headerContent;
export const modalHeaderLeadingClass = styles.headerLeading;
export const modalHeaderTitleBlockClass = styles.headerTitleBlock;
export const modalHeaderTitleRowClass = styles.headerTitleRow;
export const modalHeaderTrailingClass = styles.headerTrailing;
export const modalCloseButtonClass = styles.closeButton;
export const modalHeaderCloseButtonClass = styles.headerCloseButton;
export const modalHeaderDividerClass = styles.headerDivider;
export const modalFooterClass = styles.footer;
export const modalFooterDividerClass = styles.footerDivider;
export const modalFooterInnerClass = styles.footerInner;

/**
 * Aggregated class lookup. The Svelte component calls this to keep the CSS
 * imports alive against the bundler's tree-shaker.
 */
export function getModalTemplateClasses(): Record<string, string> {
  return {
    wrapper: modalWrapperClass,
    backdrop: modalBackdropClass,
    header: modalHeaderClass,
    emptyHeaderCapsule: modalEmptyHeaderCapsuleClass,
    headerContent: modalHeaderContentClass,
    headerLeading: modalHeaderLeadingClass,
    headerTitleBlock: modalHeaderTitleBlockClass,
    headerTitleRow: modalHeaderTitleRowClass,
    headerTrailing: modalHeaderTrailingClass,
    closeButton: modalCloseButtonClass,
    headerCloseButton: modalHeaderCloseButtonClass,
    headerDivider: modalHeaderDividerClass,
    footer: modalFooterClass,
    footerDivider: modalFooterDividerClass,
    footerInner: modalFooterInnerClass,
  } as const;
}
