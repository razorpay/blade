import { cva } from 'class-variance-authority';
// @ts-expect-error - CSS modules may not have type definitions in build
import styles from './announcementBanner.module.css';

export type AnnouncementBannerAlignment = 'center' | 'left';

export type AnnouncementBannerTheme = 'light' | 'dark';

export type AnnouncementBannerVariants = {
  alignment?: AnnouncementBannerAlignment;
};

/**
 * CVA-based AnnouncementBanner styles
 */
export const announcementBannerStyles = cva(styles['announcement-banner'], {
  variants: {
    alignment: {
      center: styles['align-center'],
      left: styles['align-left'],
    },
  },
  defaultVariants: {
    alignment: 'center',
  },
});

/**
 * Generate all classes for the AnnouncementBanner container
 */
export function getAnnouncementBannerClasses(
  props: AnnouncementBannerVariants & { className?: string },
): string {
  const { className, ...cvaProps } = props;
  return [announcementBannerStyles(cvaProps), className].filter(Boolean).join(' ');
}

// Structural class for the leading icon wrapper
export const announcementBannerIconWrapperClass = styles['icon-wrapper'];

/**
 * Get text color token based on color scheme
 */
export function getAnnouncementBannerTextColorToken(isDark: boolean): string {
  return isDark ? 'surface.text.staticWhite.subtle' : 'surface.text.gray.subtle';
}

/**
 * Get icon color token based on color scheme
 */
export function getAnnouncementBannerIconColorToken(isDark: boolean): string {
  return isDark ? 'surface.icon.staticWhite.subtle' : 'surface.icon.gray.subtle';
}

/**
 * Get all AnnouncementBanner template classes as an object.
 * Use this function in Svelte components to prevent tree-shaking from removing
 * class imports that are only used in templates.
 */
export function getAnnouncementBannerTemplateClasses(): Record<string, string> {
  return {
    banner: styles['announcement-banner'],
    iconWrapper: announcementBannerIconWrapperClass,
    alignCenter: styles['align-center'],
    alignLeft: styles['align-left'],
  } as const;
}
