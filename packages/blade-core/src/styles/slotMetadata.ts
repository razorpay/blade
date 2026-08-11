import { accordionSlotMeta } from './Accordion/slots';
import { amountSlotMeta } from './Amount/slots';
import { announcementBannerSlotMeta } from './AnnouncementBanner/slots';
import { appBarLeadingSlotMeta } from './AppBarLeading/slots';
import { avatarSlotMeta } from './Avatar/slots';
import { buttonSlotMeta } from './Button/slots';
import { cardSlotMeta } from './Card/slots';
import { dividerSlotMeta } from './Divider/slots';
import { headingSlotMeta } from './Heading/slots';
import { iconButtonSlotMeta } from './IconButton/slots';
import { textSlotMeta } from './Text/slots';

/**
 * Every component that accepts `styleOverride`, with its slot inventory and per-slot
 * safety rules. Each entry is defined next to the slot union it documents, so a new slot
 * cannot ship undocumented.
 *
 * Declaration order is the order surfaces should list components in.
 */
export const BLADE_SLOT_METADATA = {
  Button: buttonSlotMeta,
  IconButton: iconButtonSlotMeta,
  Text: textSlotMeta,
  Heading: headingSlotMeta,
  Amount: amountSlotMeta,
  AnnouncementBanner: announcementBannerSlotMeta,
  Card: cardSlotMeta,
  AppBarLeading: appBarLeadingSlotMeta,
  Divider: dividerSlotMeta,
  Avatar: avatarSlotMeta,
  Accordion: accordionSlotMeta,
} as const;

export type SlotMetadataComponentName = keyof typeof BLADE_SLOT_METADATA;

export const SLOT_METADATA_COMPONENT_NAMES = Object.keys(
  BLADE_SLOT_METADATA,
) as SlotMetadataComponentName[];

export const getComponentSlotNames = (name: SlotMetadataComponentName): readonly string[] =>
  BLADE_SLOT_METADATA[name].slots.map((slot) => slot.name);
