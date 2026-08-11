import { defineComponentSlotMeta } from '../shared/slotMeta';

export type AnnouncementBannerSlot = 'root' | 'icon' | 'text';

export const announcementBannerSlotMeta = defineComponentSlotMeta<AnnouncementBannerSlot>(
  'AnnouncementBannerSlot',
  {
    root: {
      description: 'Banner strip surface. No interactive states, so a flat fill is safe here.',
      safeProperties: ['background-color', 'background-image', 'border-radius', 'padding'],
    },
    icon: {
      description: 'Leading icon wrapper; the svg paints with `currentColor`.',
      safeProperties: ['color', 'width', 'height'],
    },
    text: {
      description: 'Banner message text.',
      safeProperties: ['color', 'font-size', 'font-weight', 'letter-spacing'],
    },
  },
);
