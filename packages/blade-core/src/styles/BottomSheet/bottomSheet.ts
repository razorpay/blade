import { cva } from 'class-variance-authority';

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
export const getBottomSheetBodyContentClasses = cva('p-spacing-5', {
  variants: {
    padding: {
      'spacing.0': 'p-spacing-0',
      'spacing.5': null,
    },
    hasActionList: {
      true: null,
      false: null,
    },
  },
  compoundVariants: [
    { padding: 'spacing.0', hasActionList: true, class: 'p-spacing-3' },
    { padding: 'spacing.5', hasActionList: true, class: 'p-spacing-3' },
  ],
  defaultVariants: {
    padding: 'spacing.5',
    hasActionList: false,
  },
});

/**
 * CVA wrapper for the body scroll container (Tailwind). The touch/scroll-behavior declarations
 * that have no Tailwind utility equivalent are combined into one arbitrary-property base class;
 * `overflow` stays a normal variant.
 */
const bottomSheetBodyBase =
  'flex-grow flex-shrink [overscroll-behavior:contain] [-webkit-overflow-scrolling:touch] [user-select:auto] [touch-action:none] [-webkit-tap-highlight-color:revert] [-webkit-touch-callout:revert] [-webkit-user-select:auto]';

export const getBottomSheetBodyClasses = cva(bottomSheetBodyBase, {
  variants: {
    overflow: {
      auto: 'overflow-auto',
      hidden: 'overflow-hidden',
      visible: 'overflow-visible',
    },
  },
  defaultVariants: {
    overflow: 'auto',
  },
});

/* Aggregated structural class names — exported individually so Svelte templates can reference them
 * and the build bundles them. Structural/stateful pieces are `.blade-bottomsheet-*` plugin classes;
 * everything else is atomic. */
export const bottomSheetSurfaceClass = 'blade-bottomsheet-surface';
export const bottomSheetBackdropClass = 'blade-bottomsheet-backdrop';
export const bottomSheetPortalRootClass = 'blade-bottomsheet-portal-root';
export const bottomSheetInnerWrapperClass = 'h-full flex flex-col';
export const bottomSheetGrabHandleClass = 'blade-bottomsheet-grab-handle';
export const bottomSheetGrabHandleFloatingClass = 'absolute';
export const bottomSheetHeaderClass = 'blade-bottomsheet-header';
export const bottomSheetHeaderContentClass = 'blade-bottomsheet-header-content';
export const bottomSheetHeaderLeadingClass = 'flex shrink-0 items-center justify-center h-[28px]';
export const bottomSheetHeaderTitleBlockClass = 'flex-[1_1_auto] min-w-0 flex flex-col';
export const bottomSheetHeaderTitleRowClass = 'flex flex-row items-center gap-spacing-3';
export const bottomSheetHeaderTitleClass =
  'font-text font-semibold text-200 leading-200 tracking-25 text-surface-text-gray-normal [margin:1px_0_0_0]';
export const bottomSheetHeaderSubtitleClass =
  'font-text font-regular text-75 leading-75 tracking-50 text-surface-text-gray-muted [margin:var(--spacing-1)_0_0_0]';
export const bottomSheetHeaderTrailingClass = 'flex shrink-0 items-center justify-center h-[28px]';
export const bottomSheetHeaderBackButtonClass = 'blade-bottomsheet-header-back-button';
export const bottomSheetHeaderCloseButtonClass = 'blade-bottomsheet-header-close-button';
// `border-0` zeroes all four sides first — without it, the other three sides fall back to the
// browser's default `medium` width + black color since Blade's preset disables `preflight`.
export const bottomSheetHeaderDividerClass =
  'border-0 border-b-thin border-solid border-b-surface-border-gray-muted w-full';
export const bottomSheetEmptyHeaderClass = 'blade-bottomsheet-header-empty';
export const bottomSheetEmptyHeaderFloatingClass = 'absolute top-spacing-5 right-spacing-0';
export const bottomSheetCloseButtonCapsuleClass = 'blade-bottomsheet-close-button-capsule';
export const bottomSheetCloseButtonCapsuleFloatingClass = 'top-spacing-0';
export const bottomSheetCloseButtonClass = 'blade-bottomsheet-close-button';
export const bottomSheetFooterClass =
  'shrink-0 w-full mt-auto bg-popup-background-gray-subtle [touch-action:none] z-[2]';
export const bottomSheetFooterInnerClass = 'blade-bottomsheet-footer-inner';
export const bottomSheetBodyClass = bottomSheetBodyBase;

/**
 * Aggregated class lookup. The Svelte component calls this to keep the class
 * references alive against the bundler's tree-shaker.
 */
export function getBottomSheetTemplateClasses(): Record<string, string> {
  return {
    surface: bottomSheetSurfaceClass,
    backdrop: bottomSheetBackdropClass,
    portalRoot: bottomSheetPortalRootClass,
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
