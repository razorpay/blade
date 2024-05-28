import React from 'react';
import type { SideNavFooterProps } from './types';
import { classes } from './tokens';
import BaseBox from '~components/Box/BaseBox';
import { drawerPadding } from '~components/Drawer';
import getIn from '~utils/lodashButBetter/get';
import type { Theme } from '~components/BladeProvider';
import { makeSpace, useTheme } from '~utils';

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
