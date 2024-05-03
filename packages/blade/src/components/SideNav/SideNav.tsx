import React from 'react';
import styled from 'styled-components';
import { SideNavContext, useSideNav } from './SideNavContext';
import type { SideNavLinkProps, SideNavProps } from './types';
import { Box } from '~components/Box';
import BaseBox from '~components/Box/BaseBox';
import { size } from '~tokens/global';
import { makeBorderSize, makeSize, makeSpace } from '~utils';
import { BaseText } from '~components/Typography/BaseText';

const StyledNavItem = styled.a((props) => {
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

const SideNavLink = ({ title, href, icon: Icon }: SideNavLinkProps): React.ReactElement => {
  const { RouterLink } = useSideNav();
  return (
    <StyledNavItem
      as={RouterLink}
      to={href}
      // for react router v5
      exact={true}
      // for react router v6
      end={true}
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
    </StyledNavItem>
  );
};

const SideNav = ({ children, routerLink: RouterLink }: SideNavProps): React.ReactElement => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const contextValue = React.useMemo(() => ({ RouterLink }), []);

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
        {children}
      </BaseBox>
    </SideNavContext.Provider>
  );
};

export { SideNav, SideNavLink };
