import { cva } from 'class-variance-authority';
// @ts-expect-error - CSS modules may not have type definitions in build
import styles from './dropdown.module.css';

/**
 * CVA-based dropdown overlay styles.
 */
export const getDropdownOverlayClasses = cva(styles.overlay);

export const dropdownContainerClass: string = styles.container;
export const dropdownOverlayPortalClass: string = styles['overlay-portal'];
export const dropdownHeaderClass: string = styles.header;
export const dropdownHeaderContentClass: string = styles.headerContent;
export const dropdownHeaderLeadingClass: string = styles.headerLeading;
export const dropdownHeaderMainClass: string = styles.headerMain;
export const dropdownHeaderTitleRowClass: string = styles.headerTitleRow;
export const dropdownHeaderTitleClass: string = styles.headerTitle;
export const dropdownHeaderSubtitleClass: string = styles.headerSubtitle;
export const dropdownHeaderTrailingClass: string = styles.headerTrailing;
export const dropdownFooterClass: string = styles.footer;

/**
 * Get all Dropdown template classes as an object.
 * Call this in Svelte components to prevent tree-shaking from removing
 * class imports that are only used in templates.
 */
export function getDropdownTemplateClasses(): Record<string, string> {
  return {
    container: styles.container,
    portal: styles['overlay-portal'],
    overlay: styles.overlay,
    header: styles.header,
    headerContent: styles.headerContent,
    headerLeading: styles.headerLeading,
    headerMain: styles.headerMain,
    headerTitleRow: styles.headerTitleRow,
    headerTitle: styles.headerTitle,
    headerSubtitle: styles.headerSubtitle,
    headerTrailing: styles.headerTrailing,
    footer: styles.footer,
  };
}
