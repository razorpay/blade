import React from 'react';

import BaseBox from '~components/Box/BaseBox';
import { drawerPadding } from '~components/Drawer';
import getIn from '~utils/lodashButBetter/get';
import { makeSpace, useTheme } from '~utils';

import { classes } from './tokens';

import type { SideNavFooterProps } from './types';
import type { Theme } from '~components/BladeProvider';

const getDrawerPadding = (theme: Theme): `${number}px` => {
  const negativePaddingValue = getIn(theme, drawerPadding);
  return makeSpace(negativePaddingValue);
};

const SideNavFooter = ({ children }: SideNavFooterProps): React.ReactElement => {
  const { theme } = useTheme();
  return (
    <BaseBox
      className={classes.L1_ITEM_WRAPPER}
      width={{
        base: `calc(100% + ${getDrawerPadding(theme)} + ${getDrawerPadding(theme)})`,
        m: '100%',
      }}
      borderTopWidth="thin"
      borderTopColor="surface.border.gray.muted"
      backgroundColor="surface.background.gray.moderate"
      position="relative"
      elevation="lowRaised"
      bottom={{ base: `-${getDrawerPadding(theme)}`, m: 'spacing.0' }}
      left={{ base: `-${getDrawerPadding(theme)}`, m: 'spacing.0' }}
      right={{ base: `-${getDrawerPadding(theme)}`, m: 'spacing.0' }}
      // in Desktop, padding is set on SideNav component
      padding={{ base: 'spacing.4', m: undefined }}
    >
      {children}
    </BaseBox>
  );
};

export { SideNavFooter };
