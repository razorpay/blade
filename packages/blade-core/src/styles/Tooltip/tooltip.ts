import { cva } from 'class-variance-authority';

export type TooltipPlacementSide = 'top' | 'right' | 'bottom' | 'left';

export type TooltipVariants = {
  placementSide?: TooltipPlacementSide;
};

/**
 * CVA-based tooltip bubble styles (Tailwind). The bubble + arrow + per-side enter transforms +
 * dark-mode borders live in the `.blade-tooltip-*` plugin classes; the `placementSide` variant
 * selects the side class that drives the enter-animation translate.
 */
export const tooltipStyles = cva('blade-tooltip-bubble', {
  variants: {
    placementSide: {
      top: 'blade-tooltip-side-top',
      right: 'blade-tooltip-side-right',
      bottom: 'blade-tooltip-side-bottom',
      left: 'blade-tooltip-side-left',
    },
  },
  defaultVariants: {
    placementSide: 'top',
  },
});

/**
 * Generate all classes for the Tooltip bubble.
 */
export function getTooltipClasses(props: TooltipVariants & { className?: string }): string {
  const { className, ...cvaProps } = props;
  return [tooltipStyles(cvaProps), className].filter(Boolean).join(' ');
}

export const tooltipTriggerClass = 'inline-block';
export const tooltipInteractiveWrapperClass = 'inline-block';
export const tooltipPortalClass = 'blade-tooltip-portal';
export const tooltipBubbleClass = 'blade-tooltip-bubble';
export const tooltipArrowClass = 'blade-tooltip-arrow';
export const tooltipTitleClass =
  'text-surface-text-static-white-normal font-text text-100 leading-100 font-semibold m-spacing-0';
export const tooltipContentClass =
  'text-surface-text-static-white-subtle font-text text-75 leading-75 font-regular [word-break:break-word] m-spacing-0';

/**
 * Get all Tooltip template classes as an object.
 * Call this in Svelte components to prevent tree-shaking from removing
 * class imports that are only used in templates.
 */
export function getTooltipTemplateClasses(): Record<string, string> {
  return {
    trigger: tooltipTriggerClass,
    interactiveWrapper: tooltipInteractiveWrapperClass,
    portal: tooltipPortalClass,
    bubble: tooltipBubbleClass,
    arrow: tooltipArrowClass,
    title: tooltipTitleClass,
    content: tooltipContentClass,
  } as const;
}
