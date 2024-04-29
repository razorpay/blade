import styled from 'styled-components';
import { Box } from '~components/Box';
import BaseBox from '~components/Box/BaseBox';
import type { IconComponent } from '~components/Icons';
import { BulkPayoutsIcon, HomeIcon, MyAccountIcon } from '~components/Icons';
import { size } from '~tokens/global';
import { makeSize, makeSpace } from '~utils';

type SideNavProps = {
  children: React.ReactNode;
};

const StyledNavItem = styled(BaseBox)((props) => {
  return {
    height: makeSize(size['36']),
    width: '100%',
    textDecoration: 'none',
    padding: `${makeSpace(props.theme.spacing[0])} ${makeSpace(props.theme.spacing[4])}`,
    color: props.theme.colors.interactive.text.gray.subtle,
    borderRadius: props.theme.border.radius.medium,
    ':hover': {
      color: props.theme.colors.interactive.text.gray.normal,
      backgroundColor: props.theme.colors.interactive.background.gray.default,
    },
  };
});

const NavItem = ({
  children,
  href,
  icon: Icon,
}: {
  children: string;
  href: string;
  icon: IconComponent;
}): React.ReactElement => {
  return (
    <StyledNavItem
      as="a"
      href={href}
      display="flex"
      flexDirection="row"
      gap="spacing.3"
      alignItems="center"
    >
      <Box>
        <Icon size="medium" color="interactive.icon.gray.subtle" />
      </Box>
      {children}
    </StyledNavItem>
  );
};

const SideNav = ({ children }: SideNavProps): React.ReactElement => {
  return (
    <BaseBox position="relative" height="100%" maxWidth={makeSize(size['256'])}>
      <BaseBox className="l1" backgroundColor="surface.background.gray.intense" padding="spacing.4">
        <NavItem icon={HomeIcon} href="#">
          Home
        </NavItem>
        <NavItem icon={BulkPayoutsIcon} href="#">
          Payouts
        </NavItem>
        <NavItem icon={MyAccountIcon} href="#">
          Account Statement
        </NavItem>
      </BaseBox>
      <BaseBox className="l2">L2 items</BaseBox>
    </BaseBox>
  );
};

export { SideNav };
