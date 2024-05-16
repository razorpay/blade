import { size } from '~tokens/global';
import { makeMotionTime, useTheme } from '~utils';

const classes = {
  SHOW_WHEN_COLLAPSED: 'show-when-collapsed',
  HIDE_WHEN_COLLAPSED: 'hide-when-collapsed',
  COLLAPSED: 'collapsed',
  TRANSITIONING: 'transitioning',
  L1_ITEM_WRAPPER: 'l1-item-wrapper',
  SHOW_ON_LINK_HOVER: 'show-on-link-hover',
};

const SKIP_NAV_ID = 'blade-side-nav-skip';

const COLLAPSED_L1_WIDTH = size['52'];
const EXPANDED_L1_WIDTH = size['256'];
const NAV_ITEM_HEIGHT = size['36'];

const useSideNavTransition = (): {
  l1Expand: string;
  l1Collapse: string;
  notchOpacity: string;
  collapseItemPadding: string;
} => {
  const { theme } = useTheme();
  const xmoderate = makeMotionTime(theme.motion.duration.xmoderate);
  const quick = makeMotionTime(theme.motion.duration.quick);
  const easing = theme.motion.easing;

  return {
    l1Expand: `width ${xmoderate} ${easing.entrance.revealing}`,
    l1Collapse: `width ${xmoderate} ${easing.exit.revealing}`,
    notchOpacity: `opacity ${xmoderate} ${easing.standard.revealing}`,
    collapseItemPadding: `padding ${quick} ${easing.standard.revealing}`,
  };
};

export {
  useSideNavTransition,
  SKIP_NAV_ID,
  classes,
  COLLAPSED_L1_WIDTH,
  EXPANDED_L1_WIDTH,
  NAV_ITEM_HEIGHT,
};
