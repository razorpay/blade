import React from 'react';
import type { SideNavFooterProps } from './types';
import { classes } from './tokens';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import BaseBox from '~components/Box/BaseBox';

const _SideNavFooter = ({ children }: SideNavFooterProps): React.ReactElement => {
  return (
    <BaseBox
      className={classes.L1_ITEM_WRAPPER}
      alignSelf="end"
      width="100%"
      elevation="highRaised"
      borderTopWidth="thin"
      borderTopColor="surface.border.gray.muted"
      backgroundColor="surface.background.gray.intense"
      position={{ base: 'absolute', m: 'relative' }}
      bottom={{ base: 'spacing.0', m: undefined }}
      left={{ base: 'spacing.0', m: undefined }}
      // in Desktop, padding is set on SideNav component
      padding={{ base: 'spacing.4', m: undefined }}
    >
      {children}
    </BaseBox>
  );
};

const SideNavFooter = assignWithoutSideEffects(_SideNavFooter, {
  componentId: 'SideNavFooter',
});

export { SideNavFooter };
