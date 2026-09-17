import { cva } from 'class-variance-authority';

export type AlertColor = 'information' | 'negative' | 'neutral' | 'notice' | 'positive' | 'primary';
export type AlertEmphasis = 'subtle' | 'intense';

export type AlertVariants = {
  color?: AlertColor;
  emphasis?: AlertEmphasis;
  isFullWidth?: boolean;
};

const alertBaseClass = 'blade-alert flex flex-row p-spacing-4 box-border rounded-medium';

/**
 * CVA-based alert styles (Tailwind). Background depends on color × emphasis together (was chained
 * `.color-*.emphasis-*` selectors) → compoundVariants. `.blade-alert` (plugin) owns align-items so
 * the desktop full-width `align-items:center` override wins over the base. The full-width action
 * layout swap is handled by the `.blade-alert-full-width` descendant rules in the plugin.
 */
export const alertStyles = cva(alertBaseClass, {
  variants: {
    color: { neutral: '', positive: '', negative: '', notice: '', information: '', primary: '' },
    emphasis: { subtle: '', intense: '' },
    isFullWidth: {
      true: 'w-full blade-alert-full-width',
      false: 'max-w-[584px]',
    },
  },
  compoundVariants: [
    { color: 'neutral', emphasis: 'subtle', class: 'bg-feedback-background-neutral-subtle' },
    { color: 'neutral', emphasis: 'intense', class: 'bg-feedback-background-neutral-intense' },
    { color: 'positive', emphasis: 'subtle', class: 'bg-feedback-background-positive-subtle' },
    { color: 'positive', emphasis: 'intense', class: 'bg-feedback-background-positive-intense' },
    { color: 'negative', emphasis: 'subtle', class: 'bg-feedback-background-negative-subtle' },
    { color: 'negative', emphasis: 'intense', class: 'bg-feedback-background-negative-intense' },
    { color: 'notice', emphasis: 'subtle', class: 'bg-feedback-background-notice-subtle' },
    { color: 'notice', emphasis: 'intense', class: 'bg-feedback-background-notice-intense' },
    { color: 'information', emphasis: 'subtle', class: 'bg-feedback-background-information-subtle' },
    {
      color: 'information',
      emphasis: 'intense',
      class: 'bg-feedback-background-information-intense',
    },
    { color: 'primary', emphasis: 'subtle', class: 'bg-interactive-background-primary-faded' },
    { color: 'primary', emphasis: 'intense', class: 'bg-interactive-background-primary-default' },
  ],
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

// Export structural classes directly (literal Tailwind / plugin class strings).
export const alertIconWrapperClass = 'flex self-start';
export const alertContentClass = 'flex-1 pl-spacing-3 pr-spacing-2';
export const alertContentFullWidthClass = 'pl-spacing-4';
export const alertContentHorizontalActionsClass = 'pr-spacing-4';
export const alertTitleClass = 'mb-spacing-2';
export const alertDescriptionClass = 'mt-spacing-1';
export const alertDescriptionWithTitleClass = 'mt-spacing-0';
export const alertActionsVerticalClass = 'blade-alert-actions-vertical';
export const alertActionsHorizontalClass = 'blade-alert-actions-horizontal';
export const alertActionPrimaryClass = 'inline-flex';
export const alertActionPrimaryWithTrailingClass = 'mr-spacing-5';
export const alertActionSecondaryClass = 'inline-flex';
export const alertActionSecondaryWithDismissClass = 'mr-spacing-4';
export const alertCloseButtonClass =
  'flex items-center justify-center bg-transparent border-none cursor-pointer p-spacing-2 rounded-medium text-inherit shrink-0 hover:opacity-80 focus-visible:[outline:2px_solid_var(--interactive-border-primary-default)] focus-visible:[outline-offset:2px]';
export const alertIconOffset1Class = 'mt-spacing-1';
export const alertIconOffset2Class = 'mt-spacing-1 max-m:mt-spacing-2';
export const alertIconWrapperCenterClass = 'self-center';
export const alertIconOffsetDescriptionOnlyClass = 'mt-[1px]';
export const alertCloseButtonDescriptionOnlyClass = 'mt-[2px]';

/**
 * Get all Alert component template classes as an object.
 * Use this function in Svelte components to prevent tree-shaking from removing
 * class imports that are only used in templates.
 */
export function getAlertTemplateClasses(): Record<string, string> {
  return {
    alert: alertBaseClass,
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
    iconWrapperCenter: alertIconWrapperCenterClass,
    iconOffsetDescriptionOnly: alertIconOffsetDescriptionOnlyClass,
    closeButtonDescriptionOnly: alertCloseButtonDescriptionOnlyClass,
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
  if (color === 'primary') {
    return 'interactive.icon.primary.normal';
  }
  return `feedback.icon.${color}.intense`;
}

/**
 * TODO: consume this util in react Alert component
 * */
/**
 * Get primary action button color based on emphasis
 */
export function getAlertActionButtonColor({
  emphasis,
}: {
  color: AlertColor;
  emphasis: AlertEmphasis;
}): 'white' | 'primary' {
  return emphasis === 'intense' ? 'white' : 'primary';
}

/**
 * Get primary action button variant based on emphasis
 */
export function getAlertActionButtonVariant({
  emphasis,
}: {
  emphasis: AlertEmphasis;
}): 'primary' | 'secondary' {
  return emphasis === 'intense' ? 'primary' : 'secondary';
}

/**
 * Get secondary action (link) color based on emphasis
 */
export function getAlertLinkColor({ emphasis }: { emphasis: AlertEmphasis }): 'white' | 'neutral' {
  return emphasis === 'intense' ? 'white' : 'neutral';
}
