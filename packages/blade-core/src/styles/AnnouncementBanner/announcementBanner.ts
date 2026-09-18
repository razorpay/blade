import { cva } from 'class-variance-authority';
import { cn } from '~utils/cx';

export type AnnouncementBannerAlignment = 'center' | 'left';

export type AnnouncementBannerTheme = 'light' | 'dark';

export type AnnouncementBannerVariants = {
  alignment?: AnnouncementBannerAlignment;
};

/**
 * CVA-based AnnouncementBanner styles (Tailwind).
 *
 * The banner surface color, text color and icon color swap to different tokens in dark mode (under
 * both the scoped `[data-blade-color-scheme='dark']` and legacy `body[data-theme='dark']` selectors),
 * which a plain utility can't express without a competing light utility winning — so those live in
 * the `.blade-announcement-banner-*` plugin component classes. Layout stays atomic.
 */
export const announcementBannerStyles = cva(
  'blade-announcement-banner-surface flex flex-row items-center gap-spacing-2 w-full box-border py-spacing-3 px-spacing-5',
  {
    variants: {
      alignment: {
        center: 'justify-center',
        left: 'justify-start',
      },
    },
    defaultVariants: {
      alignment: 'center',
    },
  },
);

/**
 * Generate all classes for the AnnouncementBanner container
 */
export function getAnnouncementBannerClasses(
  props: AnnouncementBannerVariants & { className?: string },
): string {
  const { className, ...cvaProps } = props;
  return cn(announcementBannerStyles(cvaProps), className);
}

// Structural class for the leading icon wrapper
export const announcementBannerIconWrapperClass = 'flex items-center shrink-0';

// Color classes that respond to dark mode (both scoped + legacy selectors), emitted by the plugin.
export const announcementBannerTextColorClass = 'blade-announcement-banner-text';
export const announcementBannerIconColorClass = 'blade-announcement-banner-icon';

/**
 * Get all AnnouncementBanner template classes as an object.
 * Use this function in Svelte components to prevent tree-shaking from removing
 * class imports that are only used in templates.
 */
export function getAnnouncementBannerTemplateClasses(): Record<string, string> {
  return {
    banner:
      'blade-announcement-banner-surface flex flex-row items-center gap-spacing-2 w-full box-border py-spacing-3 px-spacing-5',
    iconWrapper: announcementBannerIconWrapperClass,
    alignCenter: 'justify-center',
    alignLeft: 'justify-start',
    textColor: announcementBannerTextColorClass,
    iconColor: announcementBannerIconColorClass,
  } as const;
}
