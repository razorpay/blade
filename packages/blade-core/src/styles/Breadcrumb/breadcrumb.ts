// @ts-expect-error - CSS modules may not have type definitions in build
import styles from './breadcrumb.module.css';

// Export structural classes directly
export const breadcrumbNavClass: string = styles['breadcrumb-nav'];
export const breadcrumbListClass: string = styles['breadcrumb-list'];
export const breadcrumbListItemClass: string = styles['breadcrumb-list-item'];
export const separatorWrapperClass: string = styles['separator-wrapper'];
export const currentPageWrapperClass: string = styles['current-page-wrapper'];
export const showLastSeparatorClass: string = styles['show-last-separator'];

// Stepper variant classes
export const breadcrumbListStepperClass: string = styles['breadcrumb-list-stepper'];
export const stepperItemClass: string = styles['stepper-item'];
export const stepperItemSelectedPrimaryClass: string = styles['stepper-item-selected-primary'];
export const stepperItemSelectedNeutralClass: string = styles['stepper-item-selected-neutral'];
export const stepperItemSelectedWhiteClass: string = styles['stepper-item-selected-white'];
export const stepperItemLinkClass: string = styles['stepper-item-link'];
export const stepperItemLinkOnLightClass: string = styles['stepper-item-link-onlight'];
export const stepperItemLinkOnDarkClass: string = styles['stepper-item-link-ondark'];

/**
 * Build the class string for the selected (current page) pill in the stepper
 * variant. The pill background is driven by the Breadcrumb `color` prop.
 */
export function getStepperItemSelectedClasses(color: 'primary' | 'neutral' | 'white'): string {
  const colorClass =
    color === 'primary'
      ? stepperItemSelectedPrimaryClass
      : color === 'white'
      ? stepperItemSelectedWhiteClass
      : stepperItemSelectedNeutralClass;
  return [stepperItemClass, colorClass].filter(Boolean).join(' ');
}

/**
 * Build the class string for an unselected (navigable) stepper item. Uses a
 * light or dark hover/focus tint depending on the Breadcrumb `color` prop
 * (`white` is meant for dark/colored surfaces).
 */
export function getStepperItemLinkClasses(color: 'primary' | 'neutral' | 'white'): string {
  const tintClass = color === 'white' ? stepperItemLinkOnDarkClass : stepperItemLinkOnLightClass;
  return [stepperItemClass, stepperItemLinkClass, tintClass].filter(Boolean).join(' ');
}

/**
 * Get all Breadcrumb component template classes as an object.
 * Use this function in Svelte components to prevent tree-shaking from removing
 * class imports that are only used in templates.
 */
export function getBreadcrumbTemplateClasses(): Record<string, string> {
  return {
    breadcrumbNav: breadcrumbNavClass,
    breadcrumbList: breadcrumbListClass,
    breadcrumbListItem: breadcrumbListItemClass,
    separatorWrapper: separatorWrapperClass,
    currentPageWrapper: currentPageWrapperClass,
    showLastSeparator: showLastSeparatorClass,
    breadcrumbListStepper: breadcrumbListStepperClass,
    stepperItem: stepperItemClass,
    stepperItemSelectedPrimary: stepperItemSelectedPrimaryClass,
    stepperItemSelectedNeutral: stepperItemSelectedNeutralClass,
    stepperItemSelectedWhite: stepperItemSelectedWhiteClass,
    stepperItemLink: stepperItemLinkClass,
    stepperItemLinkOnLight: stepperItemLinkOnLightClass,
    stepperItemLinkOnDark: stepperItemLinkOnDarkClass,
  } as const;
}

/**
 * Get the breadcrumb text size mapping from BreadcrumbSize to BaseText fontSize/lineHeight.
 * Matches body text size mapping: small→75, medium→100, large→200.
 */
export function getBreadcrumbTextSizes(): {
  fontSize: Record<'small' | 'medium' | 'large', 75 | 100 | 200>;
  lineHeight: Record<'small' | 'medium' | 'large', 75 | 100 | 200>;
} {
  return {
    fontSize: {
      small: 75,
      medium: 100,
      large: 200,
    },
    lineHeight: {
      small: 75,
      medium: 100,
      large: 200,
    },
  };
}
