import React from 'react';
import styled from 'styled-components';
import { FloatingPortal } from '@floating-ui/react';
import { useSideNav } from './SideNavContext';
import type { SideNavLinkProps } from './types';
import { Box } from '~components/Box';
import { size } from '~tokens/global';
import { makeBorderSize, makeSize, makeSpace } from '~utils';
import { BaseText } from '~components/Typography/BaseText';

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

const SideNavLink = ({
  title,
  href,
  children,
  icon: Icon,
}: SideNavLinkProps): React.ReactElement => {
  const { RouterLink, l2PortalContainerRef, setIsL2Open, isL2Open } = useSideNav();
  // const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <StyledNavLink
      as={RouterLink}
      to={href}
      // for react router v5
      exact={true}
      // for react router v6
      end={true}
      onClick={() => {
        if (children) {
          setIsL2Open(true);
        }
      }}
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
      {children ? <FloatingPortal root={l2PortalContainerRef}>{children}</FloatingPortal> : null}
    </StyledNavLink>
  );
};

export { SideNavLink };
