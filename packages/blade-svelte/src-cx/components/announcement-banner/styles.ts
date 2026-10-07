import type { Snippet } from 'svelte';
import type { AxisValue } from '../../axes';
import type { IconSource } from '../../runes/icon/source';

/** The blade taxonomy as data: Blade DSL's Announcement Banner (Figma). */
export const ANNOUNCEMENT_BANNER_AXES = {
  alignment: ['center', 'left'],
} as const;

type Axis<K extends keyof typeof ANNOUNCEMENT_BANNER_AXES> = AxisValue<
  typeof ANNOUNCEMENT_BANNER_AXES,
  K
>;

/** Derived from ANNOUNCEMENT_BANNER_AXES: add a value there, never here. */
export interface AnnouncementBannerStyleProps {
  /** Where the content sits along the bar. @default 'center' */
  alignment?: Axis<'alignment'>;
}

export interface AnnouncementBannerClasses {
  /** The bar: `class` from the caller lands here. */
  root: string;
  /** The box around the leading icon. */
  icon: string;
  /** The message: one line, cut off with an ellipsis. */
  text: string;
}

const ALIGNMENT: Record<Axis<'alignment'>, string> = {
  center: 'justify-center text-center',
  left: 'justify-start text-start',
};

// Blade DSL's Announcement Banner (Figma): the subtle gray surface, 8px
// above and below, 16px at the sides, the 16px icon 4px before the message;
// the message in Body/SmallMedium (12/18, no letter-spacing) in the subtle
// text colour, on one line.
export function resolveAnnouncementBanner(
  props: AnnouncementBannerStyleProps = {},
): AnnouncementBannerClasses {
  return {
    root: `flex w-full flex-row items-center gap-1 bg-surface-gray-subtle px-4 py-2 ${ALIGNMENT[props.alignment ?? 'center']}`,
    icon: 'flex shrink-0 items-center text-surface-gray-subtle',
    text: 'm-0 min-w-0 font-blade-text text-75 [line-height:1.125rem] font-blade-medium text-surface-gray-subtle clamp-1',
  };
}

/**
 * A one-line message across the top of a page or section: an offer, a
 * notice. A labelled region, with no actions of its own beyond an inline
 * Link in the message.
 */
export interface AnnouncementBannerBehaviourProps {
  /** Before the message, in its colour. */
  icon?: IconSource;
  /** Names the region for screen readers. @default 'Announcement' */
  accessibilityLabel?: string;
  testID?: string;
  class?: string;
  /** The message: text, with an inline Link if needed. Keep it short. */
  children: Snippet;
}
