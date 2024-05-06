import React from 'react';
import { SideNavContext } from './SideNavContext';
import type { SideNavProps } from './types';
import BaseBox from '~components/Box/BaseBox';
import { size } from '~tokens/global';
import { makeSize } from '~utils';

const SideNav = ({ children, routerLink: RouterLink }: SideNavProps): React.ReactElement => {
  const l2PortalContainerRef = React.useRef(null);
  const [isL2Open, setIsL2Open] = React.useState(false);
  const contextValue = React.useMemo(
    () => ({ RouterLink, l2PortalContainerRef, isL2Open, setIsL2Open }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isL2Open],
  );

  return (
    <SideNavContext.Provider value={contextValue}>
      <BaseBox
        position="fixed"
        backgroundColor="surface.background.gray.intense"
        height="100%"
        top="spacing.0"
        left="spacing.0"
        width={makeSize(size['256'])}
        padding="spacing.4"
        borderRightWidth="thin"
        borderRightColor="surface.border.gray.muted"
      >
        <BaseBox ref={l2PortalContainerRef} marginLeft="52px" />
      </BaseBox>
      <BaseBox
        position="fixed"
        backgroundColor="surface.background.gray.intense"
        height="100%"
        top="spacing.0"
        left="spacing.0"
        width={isL2Open ? '52px' : makeSize(size['256'])}
        padding="spacing.4"
        borderRightWidth="thin"
        borderRightColor="surface.border.gray.muted"
        // onMouseOver={() => {
        //   setIsL2Open(false);
        // }}
        // onMouseOut={() => {
        //   setIsL2Open(true);
        // }}
      >
        {children}
      </BaseBox>
    </SideNavContext.Provider>
  );
};

export { SideNav };
