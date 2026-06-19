import { cva } from 'class-variance-authority';
// @ts-expect-error - CSS modules may not have type definitions in build
import styles from './announcementBanner.module.css';

export type AnnouncementBannerTheme = 'dark' | 'light';
export type AnnouncementBannerAlignment = 'center' | 'left';

export type AnnouncementBannerVariants = {
  theme?: AnnouncementBannerTheme;
  alignment?: AnnouncementBannerAlignment;
};

/**
 * CVA-based AnnouncementBanner styles
 */
export const announcementBannerStyles = cva(styles['announcement-banner'], {
  variants: {
    theme: {
      dark: styles['theme-dark'],
      light: styles['theme-light'],
    },
    alignment: {
      center: styles['align-center'],
      left: styles['align-left'],
    },
  },
  defaultVariants: {
    theme: 'dark',
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
 * Get text color token based on theme
 */
export function getAnnouncementBannerTextColorToken(theme: AnnouncementBannerTheme): string {
  return theme === 'dark' ? 'surface.text.staticWhite.subtle' : 'surface.text.gray.subtle';
}

/**
 * Get icon color token based on theme
 */
export function getAnnouncementBannerIconColorToken(theme: AnnouncementBannerTheme): string {
  return theme === 'dark' ? 'surface.icon.staticWhite.subtle' : 'surface.icon.gray.subtle';
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
    themeDark: styles['theme-dark'],
    themeLight: styles['theme-light'],
    alignCenter: styles['align-center'],
    alignLeft: styles['align-left'],
  } as const;
}
