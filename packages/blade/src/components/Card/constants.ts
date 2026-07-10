// used for interactive card scale down animation
export const CARD_SCALE_DOWN_VALUE = 0.95;
export const CARD_SCALE_UP_VALUE = 1.05;
export const CARD_LINK_OVERLAY_ID = 'card-link-overlay';

/**
 * Radius of the semicircular notch cut into the left & right edges of a `ticket` Card at the
 * tear line. Figma renders a 20px diameter cut-circle, hence a 10px radius.
 */
export const CARD_TICKET_NOTCH_RADIUS = 10;

/**
 * Geometry of the scalloped perforation drawn along the ticket tear line. Figma renders ~4px deep
 * scallops repeating every ~16px, so the perforation reads as a torn/stamp edge between the two
 * sections.
 */
export const CARD_TICKET_SCALLOP_RADIUS = 4;
export const CARD_TICKET_SCALLOP_PERIOD = 16;
