import { cva } from 'class-variance-authority';
// @ts-expect-error - CSS modules may not have type definitions in build
import styles from './tooltip.module.css';

export type TooltipPlacementSide = 'top' | 'right' | 'bottom' | 'left';

export type TooltipVariants = {
  placementSide?: TooltipPlacementSide;
};

/**
 * CVA-based tooltip bubble styles. The `placementSide` variant drives the
 * enter-animation translate axis/sign so the bubble slides in toward the
 * trigger.
 */
export const tooltipStyles = cva(styles.bubble, {
  variants: {
    placementSide: {
      top: styles['side-top'],
      right: styles['side-right'],
      bottom: styles['side-bottom'],
      left: styles['side-left'],
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

export const tooltipTriggerClass = styles.trigger;
export const tooltipInteractiveWrapperClass = styles['interactive-wrapper'];
export const tooltipPortalClass = styles.portal;
export const tooltipBubbleClass = styles.bubble;
export const tooltipArrowClass = styles.arrow;
export const tooltipTitleClass = styles.title;
export const tooltipContentClass = styles.content;

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
