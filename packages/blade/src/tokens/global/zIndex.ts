export type ZIndex = Readonly<{
  /** -1: Hides element behind all other content */
  hide: -1;
  /** 0: Default document flow, no stacking */
  base: 0;
  /** 100: Sticky UI chrome — top nav, bottom nav, bottom sheet handles */
  sticky: 100;
  /** 1000: Full-screen blocking overlays — modal backdrops */
  overlay: 1000;
  /** 1001: Slide-in side panels — drawers */
  drawer: 1001;
  /** 1002: Inline dropdown and select overlays */
  dropdown: 1002;
  /** 1100: Floating contextual UI — popovers, tooltips, tour masks, preview panels */
  popover: 1100;
}>;

export const zIndex: ZIndex = {
  hide: -1,
  base: 0,
  sticky: 100,
  overlay: 1000,
  drawer: 1001,
  dropdown: 1002,
  popover: 1100,
};
