import { Link, MemoryRouter, useLocation, matchPath } from 'react-router-dom';
import {
  SideNav,
  SideNavBody,
  SideNavFooter,
  SideNavSection,
  SideNavLink,
  SideNavItem,
  SideNavLevel,
} from '../index';
import type { SideNavLinkProps, SideNavProps } from '../index';
import { Indicator } from '~components/Indicator';
import { Switch } from '~components/Switch';
import { HomeIcon, PaymentGatewayIcon, PaymentLinkIcon } from '~components/Icons';

const isItemActive = (
  location: { pathname: string },
  { href, activeOnLinks }: { href?: string; activeOnLinks?: string[] },
): boolean => {
  const isCurrentPathActive = Boolean(
    matchPath(location.pathname, {
      path: href,
      exact: false,
    }),
  );

  const isSubItemActive = Boolean(
    activeOnLinks?.find((href) => matchPath(location.pathname, { path: href, exact: false })),
  );

  return isCurrentPathActive || isSubItemActive;
};

const NavLink = (
  props: Omit<SideNavLinkProps, 'as'> & {
    activeOnLinks?: string[];
  },
): React.ReactElement => {
  const location = useLocation();

  return (
    <SideNavLink
      {...props}
      as={Link}
      isActive={isItemActive(location, { href: props.href, activeOnLinks: props.activeOnLinks })}
    />
  );
};

const SideNavExample = ({
  initialEntries = ['/home'],
  ...args
}: Omit<SideNavProps, 'children'> & { initialEntries?: string[] }): React.ReactElement => {
  return (
    <MemoryRouter initialEntries={initialEntries}>
      <SideNav {...args}>
        <SideNavBody>
          <NavLink icon={HomeIcon} title="Home" href="/home" />
          <NavLink
            title="L2 Trigger"
            href="/l2-item"
            activeOnLinks={['/l2-item', '/l2-item-2', '/l3-item', '/l3-item-2']}
          >
            <SideNavLevel>
              <NavLink title="L2 Item" href="/l2-item" />
              <NavLink title="L2 Item 2" href="/l2-item-2" />
              <NavLink title="L3 Trigger" activeOnLinks={['/l3-item', '/l3-item-2']}>
                <SideNavLevel>
                  <NavLink title="L3 Item" href="/l3-item" />
                  <NavLink title="L3 Item 2" href="/l3-item-2" />
                </SideNavLevel>
              </NavLink>
            </SideNavLevel>
          </NavLink>

          <SideNavSection title="Products">
            <NavLink icon={PaymentGatewayIcon} title="Gateway" href="/gateway" />
            <NavLink icon={PaymentLinkIcon} title="Links" href="/links" />
          </SideNavSection>
        </SideNavBody>
        <SideNavFooter>
          <SideNavItem
            leading={<Indicator color="positive" accessibilityLabel="Positive Indicator" />}
            title="Test Mode"
            trailing={<Switch accessibilityLabel="Test Mode" />}
          />
        </SideNavFooter>
      </SideNav>
    </MemoryRouter>
  );
};
export { SideNavExample };
