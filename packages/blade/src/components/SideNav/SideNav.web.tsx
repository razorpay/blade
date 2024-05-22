import React from 'react';
import styled from 'styled-components';
import { SideNavContext } from './SideNavContext';
import type { SideNavContextType, SideNavProps } from './types';
import {
  classes,
  COLLAPSED_L1_WIDTH,
  EXPANDED_L1_WIDTH,
  SKIP_NAV_ID,
  useSideNavTransition,
} from './tokens';
import BaseBox from '~components/Box/BaseBox';
import { makeSize, makeSpace } from '~utils';
import { Drawer, DrawerBody, DrawerHeader } from '~components/Drawer';
import { SkipNavContent, SkipNavLink } from '~components/SkipNav/SkipNav';
import { useIsMobile } from '~utils/useIsMobile';
import { getStyledProps } from '~components/Box/styledProps';

const {
  COLLAPSED,
  SHOW_WHEN_COLLAPSED,
  HIDE_WHEN_COLLAPSED,
  TRANSITIONING,
  L1_ITEM_WRAPPER,
} = classes;

const MobileL1Container = styled(BaseBox)(() => {
  return {
    [`.${SHOW_WHEN_COLLAPSED}`]: {
      display: 'none',
    },
  };
});

const StyledL1Menu = styled(BaseBox)((props) => {
  const { l1Collapse, l1Expand } = useSideNavTransition();

  return {
    width: '100%',
    transition: l1Expand,
    [`& > .${L1_ITEM_WRAPPER}`]: {
      padding: makeSpace(props.theme.spacing[3]),
    },
    [`.${SHOW_WHEN_COLLAPSED}`]: {
      display: 'none',
    },
    [`&.${COLLAPSED}`]: {
      width: makeSize(COLLAPSED_L1_WIDTH),
      transition: l1Collapse,
      [`& > .${L1_ITEM_WRAPPER}`]: {
        padding: `${makeSpace(props.theme.spacing[3])} ${makeSpace(props.theme.spacing[3])}`,
      },
      [`&:not(.${TRANSITIONING}) .${HIDE_WHEN_COLLAPSED}`]: {
        display: 'none',
      },
      [`&:not(.${TRANSITIONING}) .${SHOW_WHEN_COLLAPSED}`]: {
        display: 'initial',
      },
    },
  };
});

const getL1MenuClassName = ({
  isL1Collapsed,
  isL1Hovered,
  isTransitioning,
}: {
  isL1Collapsed: boolean;
  isL1Hovered: boolean;
  isTransitioning: boolean;
}): string => {
  const isMenuCollapsed = isL1Collapsed && !isL1Hovered;

  if (isMenuCollapsed) {
    if (isTransitioning) {
      return `${COLLAPSED} ${TRANSITIONING}`;
    }

    return COLLAPSED;
  }

  return '';
};

const SideNav = ({
  children,
  isOpen,
  onDismiss,
  ...styledProps
}: SideNavProps): React.ReactElement => {
  const l2PortalContainerRef = React.useRef(null);
  const l1ContainerRef = React.useRef<HTMLDivElement>(null);
  const [isL1Collapsed, setIsL1Collapsed] = React.useState(false);
  const [isMobileL2Open, setIsMobileL2Open] = React.useState(false);
  const [isL1Hovered, setIsL1Hovered] = React.useState(false);
  const [isHoverAgainEnabled, setIsHoverAgainEnabled] = React.useState(true);
  const [isTransitioning, setIsTransitioning] = React.useState(false);
  const [l2DrawerTitle, setL2DrawerTitle] = React.useState('');

  const isMobile = useIsMobile();

  const closeMobileNav = (): void => {
    if (isMobile) {
      setIsMobileL2Open(false);
      onDismiss?.();
    }
  };

  /**
   * Handles L1 -> L2 menu changes based on active item
   */
  const onLinkActiveChange: SideNavContextType['onLinkActiveChange'] = (args) => {
    const isL1ItemActive = args.level === 1 && args.isActive;

    if (isL1ItemActive) {
      if (args.isL2Trigger) {
        // Click on L2 Trigger
        if (isMobile) {
          setL2DrawerTitle(args.title);
          setIsMobileL2Open(true);
          return;
        }

        setIsL1Collapsed(true);

        // `args.isFirstRender` checks if the item that triggered this change, triggered it during first render or during subsequent change
        if (!args.isFirstRender) {
          setIsTransitioning(true);
          setIsL1Hovered(false);
          setIsHoverAgainEnabled(false);
          // For some delay, we disable hover to expand behaviour to avoid buggy flicker when cursor is on L1 while its trying to close
          setTimeout(() => {
            setIsHoverAgainEnabled(true);
          }, 500);
        }
      } else {
        // Click on normal L1 Item
        // eslint-disable-next-line no-lonely-if
        if (isMobile) {
          setIsMobileL2Open(false);
        }
      }
    }
  };

  const contextValue = React.useMemo(
    () => ({
      l2PortalContainerRef,
      onLinkActiveChange,
      closeMobileNav,
      isL1Collapsed: isMobile ? isMobileL2Open : isL1Collapsed,
      setIsL1Collapsed,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isL1Collapsed, isMobile, isMobileL2Open],
  );

  return (
    <SideNavContext.Provider value={contextValue}>
      {isMobile && onDismiss ? (
        <>
          {/* L1 */}
          <Drawer isOpen={isOpen ?? false} onDismiss={onDismiss}>
            <DrawerHeader title="Main Menu" />
            <DrawerBody>
              <MobileL1Container
                display="flex"
                flexDirection="column"
                justifyContent="space-between"
                className="mobile-l1-container"
                height="100%"
              >
                {children}
              </MobileL1Container>
            </DrawerBody>
          </Drawer>
          {/* L2 */}
          <Drawer isOpen={isMobileL2Open} onDismiss={() => setIsMobileL2Open(false)} isLazy={false}>
            <DrawerHeader title={l2DrawerTitle} />
            <DrawerBody>
              <BaseBox ref={l2PortalContainerRef} />
            </DrawerBody>
          </Drawer>
        </>
      ) : (
        <BaseBox
          position="fixed"
          backgroundColor="surface.background.gray.moderate"
          height="100%"
          top="spacing.0"
          left="spacing.0"
          display={{ base: 'none', m: 'block' }}
          width={makeSize(EXPANDED_L1_WIDTH)}
          as="nav"
          {...getStyledProps(styledProps)}
        >
          <BaseBox
            position="absolute"
            backgroundColor="surface.background.gray.moderate"
            height="100%"
            width="100%"
            id="blade-sidenav-l2"
            ref={l2PortalContainerRef}
          />
          <StyledL1Menu
            ref={l1ContainerRef}
            id="blade-sidenav-l1"
            className={getL1MenuClassName({ isL1Collapsed, isL1Hovered, isTransitioning })}
            position="absolute"
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            backgroundColor="surface.background.gray.moderate"
            height="100%"
            overflow="hidden"
            top="spacing.0"
            left="spacing.0"
            borderRightWidth="thin"
            borderRightColor="surface.border.gray.muted"
            onTransitionEnd={(e) => {
              // This check ensures transitioning is set to false only when its true
              // And only the l1Container element's transitions are considered and other transitions of l1 expand or child elements are ignored
              if (isTransitioning && l1ContainerRef.current === e.target) {
                setIsTransitioning(false);
              }
            }}
            onMouseOver={() => {
              if (isL1Collapsed && isHoverAgainEnabled) {
                setIsL1Hovered(true);
              }
            }}
            onMouseOut={() => {
              if (isL1Collapsed) {
                setIsL1Hovered(false);
                setIsTransitioning(true);
              }
            }}
          >
            <SkipNavLink id={SKIP_NAV_ID} _hasBackground={true} />
            {children}
          </StyledL1Menu>
          <SkipNavContent id={SKIP_NAV_ID} />
        </BaseBox>
      )}
    </SideNavContext.Provider>
  );
};

export { SideNav };
