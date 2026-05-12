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
    footer: styles.footer,
  };
}
