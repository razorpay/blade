import { cva } from 'class-variance-authority';

/**
 * Default z-index for the Modal. Mirrors React's `componentZIndices.modal`.
 * Exposed alongside the CVA like `BOTTOM_SHEET_Z_INDEX`.
 */
export const MODAL_Z_INDEX = 1000;

export type ModalSize = 'small' | 'medium' | 'large' | 'full';
export type ModalBodyPadding = 'spacing.0' | 'spacing.6';

/**
 * CVA wrapper for the Modal surface (Tailwind). `size` selects the max-width; `full` additionally
 * flips the centering/scale-in behavior via the `:not(.blade-modal-size-full)` compound in the
 * `.blade-modal-surface` plugin class. The open/closed animation is handled in CSS via the
 * `data-state` attribute (also in the plugin).
 */
export const getModalSurfaceClasses = cva('blade-modal-surface', {
  variants: {
    size: {
      small: 'max-w-[400px]',
      medium: 'max-w-[760px]',
      large: 'max-w-[1024px]',
      full: 'blade-modal-size-full',
    },
  },
  defaultVariants: {
    size: 'small',
  },
});

/**
 * CVA wrapper for the Modal body. `padding` toggles between the default
 * `spacing.6` and `spacing.0`; `hasHeight` applies an explicit height fed via
 * the `--modal-body-height` CSS variable (consumed via an arbitrary value).
 */
export const getModalBodyClasses = cva('overflow-y-auto overflow-x-hidden', {
  variants: {
    padding: {
      'spacing.0': 'p-spacing-0',
      'spacing.6': 'p-spacing-6',
    },
    hasHeight: {
      true: 'h-[var(--modal-body-height)]',
      false: null,
    },
  },
  defaultVariants: {
    padding: 'spacing.6',
    hasHeight: false,
  },
});

/* Structural class names — exported individually so Svelte templates can
 * reference them. Calling `getModalTemplateClasses()` from the component
 * anchors them against tree-shaking. */
export const modalWrapperClass = 'fixed z-[var(--modal-z-index,1000)]';
export const modalBackdropClass = 'blade-modal-backdrop';
export const modalHeaderClass = 'shrink-0';
export const modalEmptyHeaderCapsuleClass =
  'flex items-center justify-center absolute top-spacing-5 right-spacing-5 w-[28px] h-[28px] shrink-0 bg-popup-background-gray-subtle rounded-max z-[1]';
export const modalHeaderContentClass =
  'flex flex-row items-start p-spacing-5 gap-spacing-3 blade-modal-header-content';
export const modalHeaderLeadingClass = 'flex shrink-0 items-center justify-center h-[28px]';
export const modalHeaderTitleBlockClass = 'flex-[1_1_auto] min-w-0 flex flex-col';
export const modalHeaderTitleRowClass = 'flex flex-row items-center gap-spacing-3';
export const modalHeaderTrailingClass = 'flex shrink-0 items-center justify-center h-[28px]';
export const modalCloseButtonClass = 'blade-modal-close-button';
export const modalHeaderCloseButtonClass = 'ml-spacing-3';
// `border-0` zeroes all four sides first — without it, the other three sides fall back to the
// browser's default `medium` width + black color since Blade's preset disables `preflight`.
export const modalHeaderDividerClass =
  'border-0 border-b-thin border-solid border-b-surface-border-gray-muted w-full';
export const modalFooterClass = 'shrink-0 w-full mt-auto';
export const modalFooterDividerClass =
  'border-0 border-t-thin border-solid border-t-surface-border-gray-muted w-full';
export const modalFooterInnerClass = 'p-spacing-5 blade-modal-footer-inner';

/**
 * Aggregated class lookup. The Svelte component calls this to keep the class
 * references alive against the bundler's tree-shaker.
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
