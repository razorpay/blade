import React from 'react';
import { classes } from './tokens';
import type { SideNavVisibilityProps } from './types';
import { useSideNav } from './SideNavContext';
import BaseBox from '~components/Box/BaseBox';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { throwBladeError } from '~utils/logger';

/**
 * Shows its children only while the SideNav is expanded, or only while it is collapsed.
 *
 * Use it for your own content inside SideNav (e.g. a custom "+3 More" link) so that it follows
 * the same collapse behaviour and transitions as the items that Blade renders.
 *
 * It follows every way SideNav collapses to icons: `isExpanded={false}`, a next level (L2) opening in a
 * SideNav without `isExpanded`, and that collapsed L1 expanding again on hover. The last two are states
 * that a consumer does not hold, which is why rendering on `isExpanded` alone is not enough.
 *
 * It works in the children of SideNav (SideNavBody, SideNavFooter). It is not meant for the `banner` slot,
 * which sits outside the part of SideNav that collapses.
 */
const SideNavVisibility = ({
  visibleWhen,
  children,
  ...rest
}: SideNavVisibilityProps): React.ReactElement => {
  const { isSideNavCollapsed } = useSideNav();

  if (__DEV__) {
    // SideNav always sets this. Outside SideNav nothing styles the classes below, so both states would stay visible
    if (isSideNavCollapsed === undefined) {
      throwBladeError({
        moduleName: 'SideNavVisibility',
        message: 'SideNavVisibility cannot be used outside of SideNav component',
      });
    }
  }

  return (
    <BaseBox
      className={`${classes.SIDE_NAV_VISIBILITY} ${
        visibleWhen === 'collapsed' ? classes.SHOW_WHEN_COLLAPSED : classes.HIDE_WHEN_COLLAPSED
      }`}
      {...makeAnalyticsAttribute(rest)}
    >
      {children}
    </BaseBox>
  );
};

export { SideNavVisibility };
