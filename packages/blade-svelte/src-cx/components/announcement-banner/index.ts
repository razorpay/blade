import type { Component } from 'svelte';
import type {
  AnnouncementBannerBehaviourProps,
  AnnouncementBannerStyleProps,
} from './styles';

export * from './styles';
export { default as AnnouncementBanner } from './AnnouncementBanner.svelte';

export type AnnouncementBannerComponent = Component<
  AnnouncementBannerBehaviourProps & AnnouncementBannerStyleProps
>;
