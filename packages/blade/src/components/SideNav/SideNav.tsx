import React from 'react';
import { SideNavContext } from './SideNavContext';
import type { ActiveLinkType, SideNavProps } from './types';
import BaseBox from '~components/Box/BaseBox';
import { size } from '~tokens/global';
import { makeSize } from '~utils';

const SideNav = ({ children, routerLink: RouterLink }: SideNavProps): React.ReactElement => {
  const l2PortalContainerRef = React.useRef(null);
  const [activeLink, setActiveLink] = React.useState<ActiveLinkType>(undefined);

  const contextValue = React.useMemo(
    () => ({ RouterLink, l2PortalContainerRef, setActiveLink }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
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
        width={activeLink?.level === 2 ? '52px' : makeSize(size['256'])}
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
