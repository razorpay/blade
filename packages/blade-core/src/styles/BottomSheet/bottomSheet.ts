import { cva } from 'class-variance-authority';
// @ts-expect-error - CSS modules may not have type definitions in build
import styles from './bottomSheet.module.css';

/**
 * Animation easing for the surface (height/opacity) transition.
 * Verbatim from React: blade/src/components/BottomSheet/BottomSheet.web.tsx
 */
export const BOTTOM_SHEET_EASING = 'cubic-bezier(.15,0,.24,.97)';

/**
 * Default z-index for the BottomSheet stack root. Matches React's
 * `componentZIndices.bottomSheet`. When stacking multiple sheets the active
 * sheet renders at this z-index and earlier sheets at `zIndex - currentStackIndex`.
 */
export const BOTTOM_SHEET_Z_INDEX = 100;

/**
 * Snap point used by AutoComplete-in-header integration. Reserved for future
 * AutoComplete migration; the docked snap-point is 85% of the viewport.
 */
export const AUTOCOMPLETE_DEFAULT_SNAPPOINT = 0.85;

/**
 * Default snap points: [lower, middle, upper] expressed as fractions of the
 * viewport height. Matches React's `snapPoints = [0.35, 0.5, 0.85]`.
 */
export const BOTTOM_SHEET_DEFAULT_SNAP_POINTS: readonly [number, number, number] = [
  0.35,
  0.5,
  0.85,
];

export type BottomSheetBodyPadding = 'spacing.0' | 'spacing.5';
export type BottomSheetBodyOverflow = 'auto' | 'hidden' | 'visible';

/**
 * CVA wrapper for the inner content padding of the BottomSheetBody.
 *
 * `padding` × `hasActionList` is a true compound variant — when an ActionList
 * lives inside the body the padding always collapses to `spacing.3`,
 * regardless of the requested padding (matches React).
 */
export const getBottomSheetBodyContentClasses = cva(styles.bodyContent, {
  variants: {
    padding: {
      'spacing.0': styles.bodyContentZeroPadding,
      'spacing.5': null,
    },
    hasActionList: {
      true: null,
      false: null,
    },
  },
  compoundVariants: [
    { padding: 'spacing.0', hasActionList: true, class: styles.bodyContentActionList },
    { padding: 'spacing.5', hasActionList: true, class: styles.bodyContentActionList },
  ],
  defaultVariants: {
    padding: 'spacing.5',
    hasActionList: false,
  },
});

/**
 * CVA wrapper for the body scroll container. Picks an `overflow` modifier.
 */
export const getBottomSheetBodyClasses = cva(styles.body, {
  variants: {
    overflow: {
      auto: styles.bodyOverflowAuto,
      hidden: styles.bodyOverflowHidden,
      visible: styles.bodyOverflowVisible,
    },
  },
  defaultVariants: {
    overflow: 'auto',
  },
});

/* Aggregated structural class names — exported individually so Svelte
 * templates can reference them and the build bundles them. CSS modules
 * export ESM objects so unused individual exports get tree-shaken; calling
 * `getBottomSheetTemplateClasses()` from the Svelte component anchors them.
 */
export const bottomSheetSurfaceClass = styles.surface;
export const bottomSheetBackdropClass = styles.backdrop;
export const bottomSheetInnerWrapperClass = styles.innerWrapper;
export const bottomSheetGrabHandleClass = styles.grabHandle;
export const bottomSheetGrabHandleFloatingClass = styles.grabHandleFloating;
export const bottomSheetHeaderClass = styles.header;
export const bottomSheetHeaderContentClass = styles.headerContent;
export const bottomSheetHeaderLeadingClass = styles.headerLeading;
export const bottomSheetHeaderTitleBlockClass = styles.headerTitleBlock;
export const bottomSheetHeaderTitleRowClass = styles.headerTitleRow;
export const bottomSheetHeaderTitleClass = styles.headerTitle;
export const bottomSheetHeaderSubtitleClass = styles.headerSubtitle;
export const bottomSheetHeaderTrailingClass = styles.headerTrailing;
export const bottomSheetHeaderBackButtonClass = styles.headerBackButton;
export const bottomSheetHeaderCloseButtonClass = styles.headerCloseButton;
export const bottomSheetHeaderDividerClass = styles.headerDivider;
export const bottomSheetEmptyHeaderClass = styles.headerEmpty;
export const bottomSheetEmptyHeaderFloatingClass = styles.headerEmptyFloating;
export const bottomSheetCloseButtonCapsuleClass = styles.closeButtonCapsule;
export const bottomSheetCloseButtonCapsuleFloatingClass = styles.closeButtonCapsuleFloating;
export const bottomSheetCloseButtonClass = styles.closeButton;
export const bottomSheetFooterClass = styles.footer;
export const bottomSheetFooterInnerClass = styles.footerInner;
export const bottomSheetBodyClass = styles.body;

/**
 * Aggregated class lookup. The Svelte component calls this to keep the CSS
 * imports alive against the bundler's tree-shaker.
 */
export function getBottomSheetTemplateClasses(): Record<string, string> {
  return {
    surface: bottomSheetSurfaceClass,
    backdrop: bottomSheetBackdropClass,
    innerWrapper: bottomSheetInnerWrapperClass,
    grabHandle: bottomSheetGrabHandleClass,
    grabHandleFloating: bottomSheetGrabHandleFloatingClass,
    header: bottomSheetHeaderClass,
    headerContent: bottomSheetHeaderContentClass,
    headerLeading: bottomSheetHeaderLeadingClass,
    headerTitleBlock: bottomSheetHeaderTitleBlockClass,
    headerTitleRow: bottomSheetHeaderTitleRowClass,
    headerTitle: bottomSheetHeaderTitleClass,
    headerSubtitle: bottomSheetHeaderSubtitleClass,
    headerTrailing: bottomSheetHeaderTrailingClass,
    headerBackButton: bottomSheetHeaderBackButtonClass,
    headerCloseButton: bottomSheetHeaderCloseButtonClass,
    headerDivider: bottomSheetHeaderDividerClass,
    emptyHeader: bottomSheetEmptyHeaderClass,
    emptyHeaderFloating: bottomSheetEmptyHeaderFloatingClass,
    closeButtonCapsule: bottomSheetCloseButtonCapsuleClass,
    closeButtonCapsuleFloating: bottomSheetCloseButtonCapsuleFloatingClass,
    closeButton: bottomSheetCloseButtonClass,
    footer: bottomSheetFooterClass,
    footerInner: bottomSheetFooterInnerClass,
    body: bottomSheetBodyClass,
  } as const;
}
