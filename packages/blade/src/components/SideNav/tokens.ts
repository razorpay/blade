import type { Theme } from '~components/BladeProvider';
import { size } from '~tokens/global';
import { makeMotionTime } from '~utils';

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
const SIDE_NAV_EXPANDED_L1_WIDTH_XL = size['264'];
const SIDE_NAV_EXPANDED_L1_WIDTH_BASE = size['245'];
const NAV_ITEM_HEIGHT = size['40'];

// This is the delay after which transition cleanup happens for rare cases where transitionEnd is not triggered
const TRANSITION_CLEANUP_DELAY = 300; // A little more than the duration of transition end

const HOVER_AGAIN_DELAY = 500;

// Delay between mouse out from L1 and L1 collapsing again
const L1_EXIT_HOVER_DELAY = 150;

const getNavItemTransition = ({ motion }: Theme): string => {
  return `background-color ${makeMotionTime(motion.duration['2xquick'])} ${motion.easing.standard}`;
};

export {
  SKIP_NAV_ID,
  classes,
  COLLAPSED_L1_WIDTH,
  SIDE_NAV_EXPANDED_L1_WIDTH_XL,
  SIDE_NAV_EXPANDED_L1_WIDTH_BASE,
  NAV_ITEM_HEIGHT,
  TRANSITION_CLEANUP_DELAY,
  HOVER_AGAIN_DELAY,
  getNavItemTransition,
  L1_EXIT_HOVER_DELAY,
};
