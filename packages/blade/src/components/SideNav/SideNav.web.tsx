import React from 'react';
import styled from 'styled-components';
import { SideNavContext } from './SideNavContext';
import type { SideNavContextType, SideNavProps } from './types';
import {
  classes,
  COLLAPSED_L1_WIDTH,
  HOVER_AGAIN_DELAY,
  L1_EXIT_HOVER_DELAY,
  SKIP_NAV_ID,
  TRANSITION_CLEANUP_DELAY,
  SIDE_NAV_EXPANDED_L1_WIDTH_BASE,
  SIDE_NAV_EXPANDED_L1_WIDTH_XL,
} from './tokens';
import BaseBox from '~components/Box/BaseBox';
import { makeBorderSize, makeMotionTime, makeSize, makeSpace } from '~utils';
import { Drawer, DrawerBody, DrawerHeader } from '~components/Drawer';
import { SkipNavContent, SkipNavLink } from '~components/SkipNav/SkipNav';
import { useIsMobile } from '~utils/useIsMobile';
import { getStyledProps } from '~components/Box/styledProps';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import type { BladeElementRef } from '~utils/types';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { size as sizeTokens } from '~tokens/global';

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
  const quick = makeMotionTime(props.theme.motion.duration.quick);
  const xmoderate = makeMotionTime(props.theme.motion.duration.xmoderate);
  const easing = props.theme.motion.easing;

  const l1Expand = `width ${xmoderate} ${easing.entrance}`;
  const l1Collapse = `width ${quick} ${easing.exit}`;

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

const BannerContainer = styled(BaseBox)((props) => {
  return {
    '&:not(:empty)': {
      borderBottom: makeBorderSize(props.theme.border.width.thin),
      borderBottomStyle: 'solid',
      borderBottomColor: props.theme.colors.surface.border.gray.muted,
      borderRight: makeBorderSize(props.theme.border.width.thin),
      borderRightStyle: 'solid',
      borderRightColor: props.theme.colors.surface.border.gray.muted,
      padding: makeSpace(props.theme.spacing[3]),
      maxHeight: makeSize(sizeTokens['100']),
      width: '100%',
    },
  };
});

/**
 * ### SideNav component
 *
 * The side navigation is positioned along the left side of the screen that provides quick access to different sections or functionalities of the application.
 *
 * ---
 *
 * #### Usage
 *
 * SideNav requires handling active state with React Router, Checkout Usage with React Router v6 at - [SideNav Documentation](https://blade.razorpay.com/?path=/docs/components-sidenav--docs)
 *
 */
const _SideNav = (
  { children, isOpen, onDismiss, banner, testID, ...rest }: SideNavProps,
  ref: React.Ref<BladeElementRef>,
): React.ReactElement => {
  const l2PortalContainerRef = React.useRef(null);
  const l1ContainerRef = React.useRef<HTMLDivElement>(null);
  const timeoutIdsRef = React.useRef<NodeJS.Timeout[]>([]);
  const mouseOverTimeoutRef = React.useRef<NodeJS.Timeout>();
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

  const cleanupTransition = (): void => {
    const clearTransitionTimeout = setTimeout(() => {
      if (isTransitioning) {
        setIsTransitioning(false);
      }
    }, TRANSITION_CLEANUP_DELAY);
    timeoutIdsRef.current.push(clearTransitionTimeout);
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
          cleanupTransition();
          setIsL1Hovered(false);
          setIsHoverAgainEnabled(false);
          // For some delay, we disable hover to expand behaviour to avoid buggy flicker when cursor is on L1 while its trying to close
          const hoverAgainTimeout = setTimeout(() => {
            setIsHoverAgainEnabled(true);
          }, HOVER_AGAIN_DELAY);
          timeoutIdsRef.current.push(hoverAgainTimeout);
        }
      } else {
        // Click on normal L1 Item
        // eslint-disable-next-line no-lonely-if
        if (isMobile) {
          setIsMobileL2Open(false);
        }
        // Ensures that if Normal L1 item is clicked, the L1 stays expanded
        setIsL1Collapsed(false);
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

  React.useEffect(() => {
    return () => {
      for (const timeoutId of timeoutIdsRef.current) {
        clearTimeout(timeoutId);
      }
      timeoutIdsRef.current = [];
    };
  }, []);

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
                {...metaAttribute({
                  name: MetaConstants.SideNav,
                  testID,
                })}
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
          ref={ref as never}
          position="fixed"
          backgroundColor="surface.background.gray.moderate"
          height="100%"
          top="spacing.0"
          left="spacing.0"
          display={{ base: 'none', m: 'flex' }}
          flexDirection="column"
          width={{
            base: makeSize(SIDE_NAV_EXPANDED_L1_WIDTH_BASE),
            xl: makeSize(SIDE_NAV_EXPANDED_L1_WIDTH_XL),
          }}
          as="nav"
          {...metaAttribute({
            name: MetaConstants.SideNav,
            testID,
          })}
          {...getStyledProps(rest)}
          {...makeAnalyticsAttribute(rest)}
        >
          {banner ? <BannerContainer>{banner}</BannerContainer> : null}
          <BaseBox position="relative" display="block" flex="1" width="100%">
            <BaseBox
              position="absolute"
              backgroundColor="surface.background.gray.moderate"
              height="100%"
              width="100%"
              top="spacing.0"
              left="spacing.0"
              id="blade-sidenav-l2"
              borderRightWidth="thin"
              borderRightColor="surface.border.gray.muted"
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
              // Hmm you might be wondering, why is `onMouseOver` paired with `onMouseLeave`? A sane person would pair `onMouseOver` with `onMouseOut`, and `onMouseEnter` with `onMouseLeave`
              // since they are logical equivalents of each other. So why don't we do that? Hold tight, you're in for a ride ☕️.
              //
              // 1. In an ideal scenario, we would put `onMouseEnter` and `onMouseLeave` here and expect things to work.
              // 2. The L2 menu of our SideNav is React Portalled out of the L1 child
              // 3. React considers its own children as true children for JS events and not DOM children (Checkout React Portal Caveats - https://react.dev/reference/react-dom/createPortal#caveats)
              // 3. In the next ideal scenario, we would put `e.stopPropagation` on child component of portal like React recommends, except mouseenter, mouseleave events don't propagate at all (https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseenter_event#usage_notes)
              // 4. So `onMouseEnter` gets triggered on L2 enter. But we don't want to open L1 menu on L2 hover
              // 5. Thus we use `onMouseOver` for hover part and call e.stopPropagation in portal child (SideNavLevel).
              // 6. But in case of unhover/leave, we don't want to trigger mouseOut for all child components individually. We want 1 hover out of L1 menu. Thus we use `onMouseLeave`
              onMouseOver={() => {
                if (mouseOverTimeoutRef.current) {
                  clearTimeout(mouseOverTimeoutRef.current);
                }
                if (isL1Collapsed && isHoverAgainEnabled) {
                  setIsL1Hovered(true);
                }
              }}
              onMouseLeave={() => {
                if (isL1Collapsed && isL1Hovered) {
                  mouseOverTimeoutRef.current = setTimeout(() => {
                    setIsL1Hovered(false);
                    setIsTransitioning(true);
                    cleanupTransition();
                  }, L1_EXIT_HOVER_DELAY);
                }
              }}
            >
              <SkipNavLink id={SKIP_NAV_ID} _hasBackground={true} />
              {children}
            </StyledL1Menu>
            <SkipNavContent id={SKIP_NAV_ID} />
          </BaseBox>
        </BaseBox>
      )}
    </SideNavContext.Provider>
  );
};

const SideNav = React.forwardRef(_SideNav);

export { SideNav };
