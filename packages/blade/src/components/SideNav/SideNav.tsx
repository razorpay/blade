import React from 'react';
import { SideNavContext } from './SideNavContext';
import type { ActiveLinkType, SideNavProps } from './types';
import BaseBox from '~components/Box/BaseBox';
import { size } from '~tokens/global';
import { makeSize } from '~utils';

const useNavLinksMutation = () => {
  const sidenavRef = React.useRef<HTMLDivElement>(null);

  const [activeLinks, setActiveLinks] = React.useState<NodeList | []>([]);

  const getActiveLink = (): NodeList | [] => {
    const allActiveLinks = sidenavRef.current?.querySelectorAll<HTMLAnchorElement>(
      'a.side-nav-link[aria-current="page"]',
    );
    const l2Triggers = sidenavRef.current?.querySelectorAll(
      'a.side-nav-link[data-l2trigger="true"]',
    );
    l2Triggers?.forEach((l2Trigger) => {
      l2Trigger.classList.remove('active');
      l2Trigger.removeAttribute('aria-current');
      console.log('Remove attribute');
    });
    console.log('L2 cleanup');

    if (allActiveLinks && allActiveLinks[0].dataset.level === '2') {
      const parentItemTag = sidenavRef.current?.querySelector(
        `a.side-nav-link#${allActiveLinks[0].dataset.parentid}`,
      );
      console.log('parentItemTag');
      parentItemTag?.classList.add('active');
      parentItemTag?.setAttribute('aria-current', 'page');
    }
    return allActiveLinks ?? [];
  };

  React.useEffect(() => {
    // Create a new MutationObserver
    const observer = new MutationObserver((mutationsList) => {
      mutationsList.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'aria-current') {
          console.log('mutation called');
          setActiveLinks(getActiveLink());
        }
      });
    });

    // Start observing changes
    const links = sidenavRef.current?.querySelectorAll('a.side-nav-link[data-l2trigger="false"]');
    console.log(links);
    if (links) {
      links.forEach((link) => {
        observer.observe(link, { attributes: true });
      });
    }

    return () => {
      // Disconnect the observer when the component unmounts
      observer.disconnect();
    };
  }, []);

  return {
    sidenavRef,
    activeLinks,
  };
};

const SideNav = ({ children, routerLink: RouterLink }: SideNavProps): React.ReactElement => {
  const l2PortalContainerRef = React.useRef(null);
  const l1ContainerRef = React.useRef<HTMLDivElement>(null);
  const [isL1Collapsed, setIsL1Collapsed] = React.useState(false);
  const { sidenavRef, activeLinks } = useNavLinksMutation();
  const [linkIds, setLinkIds] = React.useState<string[]>([]);
  console.log({ linkIds });

  const contextValue = React.useMemo(
    () => ({ RouterLink, l2PortalContainerRef, setLinkIds }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  React.useEffect(() => {
    console.log({ activeLinks });
  }, [activeLinks]);

  return (
    <SideNavContext.Provider value={contextValue}>
      <BaseBox
        position="fixed"
        backgroundColor="surface.background.gray.intense"
        height="100%"
        top="spacing.0"
        left="spacing.0"
        width={makeSize(size['256'])}
        ref={sidenavRef}
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
          width={isL1Collapsed ? '52px' : '50%'}
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
