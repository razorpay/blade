import React from 'react';
import styled from 'styled-components';
import { FloatingPortal } from '@floating-ui/react';
import { useSideNav } from './SideNavContext';
import type { NavLinkContextType, SideNavLinkProps } from './types';
import { Box } from '~components/Box';
import { size } from '~tokens/global';
import { makeBorderSize, makeMotionTime, makeSize, makeSpace } from '~utils';
import { BaseText } from '~components/Typography/BaseText';
import { useId } from '~utils/useId';
import { ChevronRightIcon } from '~components/Icons';
import BaseBox from '~components/Box/BaseBox';

const StyledNavLink = styled.a((props) => {
  return {
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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

    '.collapsed &': {
      width: '36px',
      transition: `width ${makeMotionTime(props.theme.motion.duration.xmoderate)} ${
        props.theme.motion.easing.exit.attentive
      }`,
      padding: '0px 10px',
      overflow: 'hidden',
      '& .hide-when-collapsed': {
        display: 'none',
      },
      '&[aria-current]': {
        '&::before': {
          opacity: 0,
          transition: 'opacity .3s ease',
        },
      },
    },
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
    '&[aria-current]:`hover`': {
      color: props.theme.colors.interactive.text.primary.normal,
      backgroundColor: props.theme.colors.interactive.background.primary.fadedHighlighted,
    },
  };
});

const NavLinkContext = React.createContext<NavLinkContextType>({});
const useNavLink = (): NavLinkContextType => {
  const value = React.useContext(NavLinkContext);
  return value;
};

const SideNavLink = ({
  title,
  href,
  children,
  isCurrentPage,
  icon: Icon,
  as,
}: SideNavLinkProps): React.ReactElement => {
  const { l2PortalContainerRef, onLinkActiveChange } = useSideNav();
  const navLinkRef = React.useRef<HTMLAnchorElement>(null);
  const { level: _prevLevel } = useNavLink();
  const prevLevel = _prevLevel ?? 0;
  const currentLevel = prevLevel + 1;
  const isL2Trigger = Boolean(children);
  const navItemId = useId('nav-item');

  React.useEffect(() => {
    onLinkActiveChange?.({
      id: navItemId,
      level: currentLevel,
      isActive: Boolean(isCurrentPage),
      isL2Trigger,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCurrentPage]);

  return (
    <NavLinkContext.Provider value={{ level: currentLevel }}>
      <StyledNavLink
        ref={navLinkRef}
        as={as}
        to={href}
        onClick={() => {
          onLinkActiveChange?.({
            id: navItemId,
            level: currentLevel,
            isActive: Boolean(isCurrentPage),
            isL2Trigger,
          });
        }}
        aria-current={isCurrentPage ? 'page' : undefined}
        data-level={currentLevel}
        data-l2Trigger={isL2Trigger}
        data-navItemId={navItemId}
      >
        <Box display="flex" flexDirection="row" gap="spacing.3">
          <BaseBox display="flex" flexDirection="row" alignItems="center" justifyContent="center">
            <Icon size="medium" color="currentColor" />
          </BaseBox>
          <BaseText
            truncateAfterLines={1}
            color="currentColor"
            fontWeight="medium"
            fontSize={100}
            lineHeight={100}
            as="p"
            className="hide-when-collapsed"
          >
            {title}
          </BaseText>
        </Box>
        {isL2Trigger ? (
          <BaseBox className="hide-when-collapsed">
            <ChevronRightIcon size="medium" color="currentColor" />
          </BaseBox>
        ) : null}
      </StyledNavLink>
      {children ? (
        <FloatingPortal root={l2PortalContainerRef}>
          {isCurrentPage ? children : null}
        </FloatingPortal>
      ) : null}
    </NavLinkContext.Provider>
  );
};

export { SideNavLink };
