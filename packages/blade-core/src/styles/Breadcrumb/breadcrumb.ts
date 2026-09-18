// Structural classes (participate in `:last-child` / child-combinator / descendant selectors) are
// emitted by the Tailwind plugin as `.blade-breadcrumb-*` component classes; referenced here by name.
export const breadcrumbNavClass = 'blade-breadcrumb-nav';
export const breadcrumbListClass = 'blade-breadcrumb-list';
export const breadcrumbListItemClass = 'blade-breadcrumb-list-item';
export const separatorWrapperClass = 'blade-breadcrumb-separator';
export const currentPageWrapperClass = 'blade-breadcrumb-current-page';
export const showLastSeparatorClass = 'blade-breadcrumb-show-last-separator';

// Stepper variant classes.
export const breadcrumbListStepperClass = 'blade-breadcrumb-list-stepper';
// Shared pill box applied to every stepper item (selected + link) — atomic utilities.
export const stepperItemClass =
  'flex items-center justify-center gap-spacing-2 min-h-[28px] py-spacing-2 px-spacing-4 rounded-large box-border';
export const stepperItemSelectedPrimaryClass = 'bg-interactive-background-primary-faded';
export const stepperItemSelectedNeutralClass = 'bg-interactive-background-gray-faded';
export const stepperItemSelectedWhiteClass = 'bg-interactive-background-static-black-faded';
// Unselected navigable link — transparent at rest; focus ring uses the stepper's own token.
export const stepperItemLinkClass =
  'bg-transparent no-underline cursor-pointer transition-colors duration-xquick ease-standard focus-visible:outline-none focus-visible:shadow-[0px_0px_0px_4px_var(--interactive-border-primary-faded)]';
export const stepperItemLinkOnLightClass =
  'hover:bg-interactive-background-gray-default focus-visible:bg-interactive-background-gray-default';
export const stepperItemLinkOnDarkClass =
  'hover:bg-interactive-background-static-white-faded focus-visible:bg-interactive-background-static-white-faded';

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
