import { isReactNative } from '~utils';

// used for interactive card scale down animation
export const CARD_SCALE_DOWN_VALUE = 0.95;
export const CARD_SCALE_UP_VALUE = 1.05;
export const CARD_LINK_OVERLAY_ID = 'card-link-overlay';

// Gives equal-width flex behaviour that works on both RN (flex) and web (flexGrow).
export const equalWidthFlexProps = isReactNative()
  ? ({ flex: 1 } as const)
  : ({ flexGrow: 1 } as const);
