import React from 'react';
import { classes } from './tokens';
import type { SideNavVisibilityProps } from './types';
import BaseBox from '~components/Box/BaseBox';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';

/**
 * Shows its children only while the SideNav is expanded, or only while it is collapsed.
 *
 * Use it for your own content inside SideNav (e.g. a custom "+3 More" link) so that it follows
 * the same collapse behaviour and transitions as the items that Blade renders.
 */
const SideNavVisibility = ({
  visibleWhen,
  children,
  ...rest
}: SideNavVisibilityProps): React.ReactElement => {
  return (
    <BaseBox
      className={
        visibleWhen === 'collapsed' ? classes.SHOW_WHEN_COLLAPSED : classes.HIDE_WHEN_COLLAPSED
      }
      {...makeAnalyticsAttribute(rest)}
    >
      {children}
    </BaseBox>
  );
};

export { SideNavVisibility };
