import React from 'react';
import { SideNavContext } from './SideNavContext';
import type { ActiveLinkType, SideNavProps } from './types';
import BaseBox from '~components/Box/BaseBox';
import { size } from '~tokens/global';
import { makeSize } from '~utils';

const SideNav = ({ children, routerLink: RouterLink }: SideNavProps): React.ReactElement => {
  const l2PortalContainerRef = React.useRef(null);
  const l1ContainerRef = React.useRef<HTMLDivElement>(null);
  const [activeLink, setActiveLink] = React.useState<ActiveLinkType>(undefined);

  const contextValue = React.useMemo(
    () => ({ RouterLink, l2PortalContainerRef, setActiveLink }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  React.useEffect(() => {
    if (activeLink?.level === 2) {
      const activeL2TriggerItems = l1ContainerRef.current?.querySelectorAll(
        '[aria-current="page"][data-l2Trigger="true"]',
      );
      activeL2TriggerItems?.forEach((el) => {
        el.removeAttribute('aria-current');
        el.classList.remove('active');
      });

      activeLink.parentLinkRef.current?.setAttribute('aria-current', 'page');
      activeLink.parentLinkRef.current?.classList.add('active');
    }
    console.log({ activeLink });
  }, [activeLink]);

  return (
    <SideNavContext.Provider value={contextValue}>
      <BaseBox
        position="fixed"
        backgroundColor="surface.background.gray.intense"
        height="100%"
        top="spacing.0"
        left="spacing.0"
        width={makeSize(size['256'])}
      >
        <BaseBox
          position="absolute"
          backgroundColor="surface.background.gray.intense"
          width="100%"
          ref={l2PortalContainerRef}
        />
        <BaseBox
          ref={l1ContainerRef}
          position="absolute"
          backgroundColor="surface.background.gray.intense"
          height="100%"
          top="spacing.0"
          left="spacing.0"
          width={activeLink?.level === 2 ? '52px' : '50%'}
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
      </BaseBox>

      {/* <BaseBox
        position="absolute"
        padding="spacing.4"
        borderRightWidth="thin"
        borderRightColor="surface.border.gray.muted"
      >
        <BaseBox ref={l2PortalContainerRef} marginLeft="52px" />
      </BaseBox> */}
    </SideNavContext.Provider>
  );
};

export { SideNav };
