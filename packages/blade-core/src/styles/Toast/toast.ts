import { cva } from 'class-variance-authority';

export type ToastColor = 'information' | 'negative' | 'neutral' | 'notice' | 'positive';
export type ToastType = 'informational' | 'promotional';

export type ToastVariants = {
  type?: ToastType;
  color?: ToastColor;
};

/**
 * CVA wrapper for the toast root element (Tailwind).
 *
 * Background color and border are driven by `type × color` compound variants because the React
 * source picks them via two-prop lookups (`isPromotional ? gray : color`). The compound rules,
 * descendant icon/content/trailing alignment overrides for the promotional type, the dismiss
 * button's hover/focus states, and the enter/exit `@keyframes` all live in the `.blade-toast-*`
 * plugin classes (see `tailwind/plugin.cjs`).
 */
export const toastStyles = cva('blade-toast', {
  variants: {
    type: {
      informational: 'blade-toast-type-informational',
      promotional: 'blade-toast-type-promotional',
    },
    color: {
      neutral: 'blade-toast-color-neutral',
      positive: 'blade-toast-color-positive',
      negative: 'blade-toast-color-negative',
      notice: 'blade-toast-color-notice',
      information: 'blade-toast-color-information',
    },
  },
  defaultVariants: {
    type: 'informational',
    color: 'neutral',
  },
});

/**
 * Build the toast root class string. Adds the enter/exit animation class
 * based on `isVisible`.
 */
export function getToastClasses(
  props: ToastVariants & { isVisible?: boolean; className?: string },
): string {
  const { className, isVisible = true, ...cvaProps } = props;
  const animationClass = isVisible ? 'blade-toast-enter' : 'blade-toast-exit';
  return [toastStyles(cvaProps), animationClass, className].filter(Boolean).join(' ');
}

/* Toast structural classes — exported individually so Svelte templates can reference them. */
export const toastIconWrapperClass = 'blade-toast-icon-wrapper';
export const toastContentClass = 'blade-toast-content';
export const toastTrailingClass = 'blade-toast-trailing';
export const toastDismissButtonClass = 'blade-toast-dismiss-button';
export const toastEnterClass = 'blade-toast-enter';
export const toastExitClass = 'blade-toast-exit';

/**
 * Aggregated structural classes. Call this from the Svelte component to
 * keep CSS class imports alive against the bundler's tree-shaker (CSS
 * modules export ESM objects, so unused individual exports get dropped).
 */
export function getToastTemplateClasses(): Record<string, string> {
  return {
    toast: 'blade-toast',
    iconWrapper: toastIconWrapperClass,
    content: toastContentClass,
    trailing: toastTrailingClass,
    dismissButton: toastDismissButtonClass,
    toastEnter: toastEnterClass,
    toastExit: toastExitClass,
  } as const;
}

/**
 * Resolve the leading-icon color for the given toast type.
 *
 * Mirrors the React source: promotional toasts use the gray icon token,
 * informational toasts always use static-white regardless of color.
 */
export function getToastIconColorToken({ type }: { type: ToastType }): string {
  return type === 'promotional' ? 'surface.icon.gray.normal' : 'surface.icon.staticWhite.normal';
}

/**
 * Resolve the body-text color for the given toast type.
 *
 * Informational text is always rendered as static-white (the React source
 * wraps content in `<Text color="surface.text.staticWhite.normal">`).
 * Promotional toasts inherit text color from the consumer-supplied snippet.
 */
export function getToastTextColorToken({ type }: { type: ToastType }): string {
  return type === 'promotional' ? 'surface.text.gray.normal' : 'surface.text.staticWhite.normal';
}

/**
 * Resolve `Button` `variant` and `color` props for the toast action button.
 *
 * Mirrors React: promotional uses secondary/primary, informational uses
 * tertiary/white.
 */
export function getToastActionButtonProps({
  type,
}: {
  type: ToastType;
}): {
  variant: 'primary' | 'secondary' | 'tertiary';
  color: 'primary' | 'white' | 'positive' | 'negative';
} {
  return type === 'promotional'
    ? { variant: 'secondary', color: 'primary' }
    : { variant: 'tertiary', color: 'white' };
}

/* Toast container constants — pulled out so consumers can import without
 * cracking open the CSS module.
 */
export const TOAST_MAX_WIDTH = 360;
export const TOAST_Z_INDEX = 2001;
export const GUTTER = 12;
export const PEEK_GUTTER = 12;
export const CONTAINER_GUTTER_MOBILE = 16;
export const CONTAINER_GUTTER_DESKTOP = 24;
export const SCALE_FACTOR = 0.05;
export const MAX_TOASTS = 1;
export const MIN_TOAST_MOBILE = 1;
export const MIN_TOAST_DESKTOP = 3;
export const PEEKS = 3;

/* Toast container structural classes */
export const toastContainerClass = 'blade-toast-container';
export const toastHoverRegionClass = 'blade-toast-hover-region';
export const toastWrapperClass = 'blade-toast-wrapper';

/**
 * Aggregated container classes — same anti-tree-shake pattern as
 * `getToastTemplateClasses`.
 */
export function getToastContainerTemplateClasses(): Record<string, string> {
  return {
    container: toastContainerClass,
    hoverRegion: toastHoverRegionClass,
    wrapper: toastWrapperClass,
  } as const;
}

/**
 * Resolve the wrapper opacity for a toast at `index` in the visible stack.
 *
 * - First `PEEKS + MAX_TOASTS` toasts: always visible (1)
 * - Promo toast: always visible (1)
 * - Expanded stack: always visible (1)
 * - Otherwise: hidden (0)
 */
export function getToastWrapperOpacity({
  index,
  isVisible,
  isExpanded,
  isPromotional,
}: {
  index: number;
  isVisible: boolean;
  isExpanded: boolean;
  isPromotional: boolean;
}): number {
  if (!isVisible) return 0;
  if (index < PEEKS + MAX_TOASTS) return 1;
  if (isPromotional || isExpanded) return 1;
  return 0;
}

type CalculateYProps = {
  index: number;
  toastsBefore: number;
  isExpanded: boolean;
  hasPromoToast: boolean;
  promoToastHeight: number;
  isPromotional: boolean;
  heightsBefore: number[];
};

/**
 * Compute `(offset, scale)` for a toast at the given position in the stack.
 *
 * Mirrors the React `calculateYPosition`:
 * - First MAX_TOASTS toasts: scale 1
 * - Subsequent toasts: scale 1 - (count_before * SCALE_FACTOR), floored at 0.7
 * - Expanded: full stack offset (sum of previous heights + GUTTER each)
 * - Collapsed: peek offset (PEEK_GUTTER per toast)
 * - Lift offset by promo height when a promo toast is present
 * - Promo toasts always at the bottom (offset 0, scale 1)
 */
export function calculateToastYPosition({
  index,
  toastsBefore,
  isExpanded,
  hasPromoToast,
  promoToastHeight,
  isPromotional,
  heightsBefore,
}: CalculateYProps): { offset: number; scale: number } {
  let scale = Math.max(0.7, 1 - toastsBefore * SCALE_FACTOR);
  if (index < MAX_TOASTS) {
    scale = 1;
  }

  let offset = 0;
  if (isExpanded) {
    offset = heightsBefore.reduce((sum, h) => sum + h + GUTTER, 0);
  } else {
    offset = toastsBefore * PEEK_GUTTER;
  }

  if (hasPromoToast) {
    offset += GUTTER + promoToastHeight;
  }

  if (isPromotional) {
    offset = 0;
    scale = 1;
  }

  return { offset, scale: isExpanded ? 1 : scale };
}
