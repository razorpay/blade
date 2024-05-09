import React from 'react';
import styled from 'styled-components';
import { FloatingPortal } from '@floating-ui/react';
import { useSideNav } from './SideNavContext';
import type { SideNavLinkProps } from './types';
import { Box } from '~components/Box';
import { size } from '~tokens/global';
import { makeBorderSize, makeSize, makeSpace } from '~utils';
import { BaseText } from '~components/Typography/BaseText';
import { useSideNavLevel } from './SideNavLevel';
import { useId } from '~utils/useId';

const StyledNavLink = styled.a((props) => {
  return {
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    gap: makeSpace(props.theme.spacing[3]),
    alignItems: 'center',
    height: makeSize(size['36']),
    width: '100%',
    textDecoration: 'none',
    overflow: 'hidden',
    flexWrap: 'nowrap',
    padding: `${makeSpace(props.theme.spacing[0])} ${makeSpace(props.theme.spacing[4])}`,
    color: props.theme.colors.interactive.text.gray.subtle,
    borderRadius: props.theme.border.radius.medium,
    border: `${makeBorderSize(props.theme.border.width.thinner)} solid ${
      props.theme.colors.transparent
    }`,
    ':hover': {
      color: props.theme.colors.interactive.text.gray.normal,
      backgroundColor: props.theme.colors.interactive.background.gray.default,
    },
    '&[aria-current]': {
      color: props.theme.colors.interactive.text.primary.subtle,
      backgroundColor: props.theme.colors.interactive.background.primary.faded,
      border: `${makeBorderSize(props.theme.border.width.thinner)} solid ${
        props.theme.colors.surface.border.primary.muted
      }`,

      '&::before': {
        content: '" "',
        position: 'absolute',
        left: '0px',
        top: '0px',
        bottom: '0px',
        margin: 'auto',
        width: makeSize(size['4']),
        height: makeSize(size['16']),
        backgroundColor: props.theme.colors.interactive.background.primary.default,
        borderRadius: `${makeBorderSize(props.theme.border.radius.none)} ${makeBorderSize(
          props.theme.border.radius.medium,
        )} ${makeBorderSize(props.theme.border.radius.medium)} ${makeBorderSize(
          props.theme.border.radius.none,
        )}`,
      },
    },
    '&[aria-current]:hover': {
      color: props.theme.colors.interactive.text.primary.normal,
      backgroundColor: props.theme.colors.interactive.background.primary.fadedHighlighted,
    },
  };
});

const NavLinkContext = React.createContext({});
const useNavLink = () => {
  const value = React.useContext(NavLinkContext);
  return value;
};

const SideNavLink = ({
  title,
  href,
  children,
  icon: Icon,
}: SideNavLinkProps): React.ReactElement => {
  const [shouldShowL2Menu, setShouldShowL2Menu] = React.useState(false);
  // const [isCurrentItemActive, setIsCurrentItemActive] = React.useState(false);
  const { RouterLink, l2PortalContainerRef, setActiveLink } = useSideNav();
  const navLinkRef = React.useRef<HTMLAnchorElement>(null);
  const { level: _prevLevel, ref: parentLinkRef } = useNavLink();
  const prevLevel = _prevLevel ?? 0;
  const currentLevel = prevLevel + 1;
  const isL2Trigger = Boolean(children);
  const navItemId = useId('nav-item');

  React.useEffect(() => {
    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'aria-current') {
          const isCurrentItemActive =
            (mutation.target as HTMLAnchorElement).getAttribute('aria-current') === 'page';
          if (isCurrentItemActive && currentLevel === 2) {
            setActiveLink({
              ref: navLinkRef,
              parentLinkRef,
              level: currentLevel,
            });
          }

          if (isCurrentItemActive && currentLevel === 1 && isL2Trigger) {
            setShouldShowL2Menu(true);
          } else if (!isCurrentItemActive && currentLevel === 1 && isL2Trigger) {
            setShouldShowL2Menu(false);
          }
        }
      }
    });

    if (navLinkRef.current) {
      observer.observe(navLinkRef.current, { attributes: true });
    }

    return () => {
      if (navLinkRef.current) {
        observer.disconnect();
      }
    };
  }, []);

  // React.useEffect(() => {
  //   if (isCurrentItemActive && currentLevel === 2) {
  //     setActiveLink({
  //       ref: navLinkRef,
  //       parentLinkRef,
  //       level: currentLevel,
  //     });
  //   }

  //   if (isCurrentItemActive && currentLevel === 1 && isL2Trigger) {
  //     setShouldShowL2Menu(true);
  //   } else if (!isCurrentItemActive && currentLevel === 1 && isL2Trigger) {
  //     setShouldShowL2Menu(false);
  //   }
  // }, [isCurrentItemActive]);

  return (
    <NavLinkContext.Provider value={{ level: currentLevel, ref: isL2Trigger ? navLinkRef : null }}>
      <StyledNavLink
        ref={navLinkRef}
        as={RouterLink}
        to={href}
        // for react router v5
        exact={true}
        // for react router v6
        end={true}
        onClick={() => {
          // const hasAriaCurrent = navLinkRef.current?.hasAttribute('aria-current');
          // const _shouldShowL2Menu = (isL2Trigger && hasAriaCurrent) ?? false;
          // // console.log({ _shouldShowL2Menu, isL2Trigger, hasAriaCurrent });
          // setShouldShowL2Menu(_shouldShowL2Menu);
        }}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        isActive={(args: Record<string, any>): boolean => {
          // console.log({ fun: 'onActiveChange', title, args });
          const _isCurrentItemActive = Boolean(args);
          // setIsCurrentItemActive(_isCurrentItemActive);
          return _isCurrentItemActive;
        }}
        data-level={currentLevel}
        data-l2Trigger={isL2Trigger}
        data-navItemId={navItemId}
      >
        <Box display="flex" flexDirection="row" alignItems="center" justifyContent="center">
          <Icon size="medium" color="currentColor" />
        </Box>
        <BaseText
          truncateAfterLines={1}
          color="currentColor"
          fontWeight="medium"
          fontSize={100}
          lineHeight={100}
        >
          {title}
        </BaseText>
        {children ? (
          <FloatingPortal root={l2PortalContainerRef}>
            {shouldShowL2Menu ? children : null}
          </FloatingPortal>
        ) : null}
      </StyledNavLink>
    </NavLinkContext.Provider>
  );
};

export { SideNavLink };
