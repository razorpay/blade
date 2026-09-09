import { defineComponentSlots } from '../shared/slotMeta';

export type AnnouncementBannerSlot = 'root' | 'icon' | 'text';

export const announcementBannerSlotMeta = defineComponentSlots<AnnouncementBannerSlot>(
  'AnnouncementBannerSlot',
  {
    root: true,
    icon: true,
    text: true,
  },
);
