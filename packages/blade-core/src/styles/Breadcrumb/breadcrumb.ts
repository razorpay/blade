// @ts-expect-error - CSS modules may not have type definitions in build
import styles from './breadcrumb.module.css';

// Export structural classes directly
export const breadcrumbNavClass: string = styles['breadcrumb-nav'];
export const breadcrumbListClass: string = styles['breadcrumb-list'];
export const breadcrumbListItemClass: string = styles['breadcrumb-list-item'];
export const separatorWrapperClass: string = styles['separator-wrapper'];
export const currentPageWrapperClass: string = styles['current-page-wrapper'];
export const showLastSeparatorClass: string = styles['show-last-separator'];

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
