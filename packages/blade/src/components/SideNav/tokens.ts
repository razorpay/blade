import { size } from '~tokens/global';

const classes = {
  SHOW_WHEN_COLLAPSED: 'show-when-collapsed',
  HIDE_WHEN_COLLAPSED: 'hide-when-collapsed',
  COLLAPSED: 'collapsed',
  TRANSITIONING: 'transitioning',
  L1_ITEM_WRAPPER: 'l1-item-wrapper',
  SHOW_ON_LINK_HOVER: 'show-on-link-hover',
  STYLED_NAV_LINK: 'styled-nav-link',
} as const;

const SKIP_NAV_ID = 'blade-side-nav-skip';

const COLLAPSED_L1_WIDTH = size['56'];
const EXPANDED_L1_WIDTH = size['264'];
const NAV_ITEM_HEIGHT = size['40'];

// This is the delay after which transition cleanup happens for rare cases where transitionEnd is not triggered
const TRANSITION_CLEANUP_DELAY = 300; // A little more than the duration of transition end

const HOVER_AGAIN_DELAY = 500;

export {
  SKIP_NAV_ID,
  classes,
  COLLAPSED_L1_WIDTH,
  EXPANDED_L1_WIDTH,
  NAV_ITEM_HEIGHT,
  TRANSITION_CLEANUP_DELAY,
  HOVER_AGAIN_DELAY,
};
