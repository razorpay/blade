import { cva } from 'class-variance-authority';
// @ts-expect-error - CSS modules may not have type definitions in build
import styles from './alert.module.css';

export type AlertColor = 'information' | 'negative' | 'neutral' | 'notice' | 'positive';
export type AlertEmphasis = 'subtle' | 'intense';

export type AlertVariants = {
  color?: AlertColor;
  emphasis?: AlertEmphasis;
  isFullWidth?: boolean;
};

/**
 * CVA-based alert styles
 */
export const alertStyles = cva(styles.alert, {
  variants: {
    color: {
      neutral: styles['color-neutral'],
      positive: styles['color-positive'],
      negative: styles['color-negative'],
      notice: styles['color-notice'],
      information: styles['color-information'],
    },
    emphasis: {
      subtle: styles['emphasis-subtle'],
      intense: styles['emphasis-intense'],
    },
    isFullWidth: {
      true: styles['full-width'],
      false: null,
    },
  },
  defaultVariants: {
    color: 'neutral',
    emphasis: 'subtle',
    isFullWidth: false,
  },
});

/**
 * Generate all classes for Alert component container
 */
export function getAlertClasses(props: AlertVariants & { className?: string }): string {
  const { className, ...cvaProps } = props;
  const classes = [alertStyles(cvaProps), className].filter(Boolean).join(' ');
  return classes;
}

// Export structural classes directly
export const alertIconWrapperClass = styles['icon-wrapper'];
export const alertContentClass = styles.content;
export const alertContentFullWidthClass = styles['content-full-width'];
export const alertContentHorizontalActionsClass = styles['content-horizontal-actions'];
export const alertTitleClass = styles.title;
export const alertDescriptionClass = styles.description;
export const alertDescriptionWithTitleClass = styles['description-with-title'];
export const alertActionsVerticalClass = styles['actions-vertical'];
export const alertActionsHorizontalClass = styles['actions-horizontal'];
export const alertActionPrimaryClass = styles['action-primary'];
export const alertActionPrimaryWithTrailingClass = styles['action-primary-with-trailing'];
export const alertActionSecondaryClass = styles['action-secondary'];
export const alertActionSecondaryWithDismissClass = styles['action-secondary-with-dismiss'];
export const alertCloseButtonClass = styles['close-button'];
export const alertIconOffset1Class = styles['icon-offset-1'];
export const alertIconOffset2Class = styles['icon-offset-2'];

/**
 * Get all Alert component template classes as an object.
 * Use this function in Svelte components to prevent tree-shaking from removing
 * class imports that are only used in templates.
 */
export function getAlertTemplateClasses(): Record<string, string> {
  return {
    alert: styles.alert,
    iconWrapper: alertIconWrapperClass,
    content: alertContentClass,
    contentFullWidth: alertContentFullWidthClass,
    contentHorizontalActions: alertContentHorizontalActionsClass,
    title: alertTitleClass,
    description: alertDescriptionClass,
    descriptionWithTitle: alertDescriptionWithTitleClass,
    actionsVertical: alertActionsVerticalClass,
    actionsHorizontal: alertActionsHorizontalClass,
    actionPrimary: alertActionPrimaryClass,
    actionPrimaryWithTrailing: alertActionPrimaryWithTrailingClass,
    actionSecondary: alertActionSecondaryClass,
    actionSecondaryWithDismiss: alertActionSecondaryWithDismissClass,
    closeButton: alertCloseButtonClass,
    iconOffset1: alertIconOffset1Class,
    iconOffset2: alertIconOffset2Class,
  } as const;
}

/**
 * Get text color token based on emphasis
 */
export function getAlertTextColorToken({ emphasis }: { emphasis: AlertEmphasis }): string {
  return emphasis === 'intense' ? 'surface.text.staticWhite.normal' : 'surface.text.gray.subtle';
}

/**
 * Get icon color token based on color and emphasis
 */
export function getAlertIconColorToken({
  color,
  emphasis,
}: {
  color: AlertColor;
  emphasis: AlertEmphasis;
}): string {
  if (emphasis === 'intense') {
    return 'surface.icon.staticWhite.normal';
  }
  return `feedback.icon.${color}.intense`;
}

/**
 * Get action button color based on emphasis and alert color
 */
export function getAlertActionButtonColor({
  color,
  emphasis,
}: {
  color: AlertColor;
  emphasis: AlertEmphasis;
}): 'white' | AlertColor {
  return emphasis === 'intense' ? 'white' : color;
}
