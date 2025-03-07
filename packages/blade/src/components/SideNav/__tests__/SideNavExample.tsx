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
import {
  HomeIcon,
  LayoutIcon,
  PaymentButtonIcon,
  PaymentGatewayIcon,
  PaymentLinkIcon,
  PaymentPagesIcon,
} from '~components/Icons';

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
      <SideNav {...args} data-analytics-side-nav="demo-item">
        <SideNavBody>
          <NavLink icon={HomeIcon} data-analytics-nav-link="home" title="Home" href="/home" />
          <NavLink
            icon={LayoutIcon}
            title="L2 Trigger"
            href="/l2-item"
            activeOnLinks={['/l2-item', '/l2-item-2', '/l3-item', '/l3-item-2']}
            data-analytics-nav-link="l2 Trigger"
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

          <SideNavSection
            title="Products"
            maxVisibleItems={2}
            data-analytics-side-nav-section="Products"
          >
            <NavLink icon={PaymentGatewayIcon} title="Gateway" href="/gateway" />
            <NavLink icon={PaymentLinkIcon} title="Links" href="/links" />
            <NavLink icon={PaymentPagesIcon} title="Pages" href="/pages" />
            <NavLink icon={PaymentButtonIcon} title="Button" href="/button" />
          </SideNavSection>
        </SideNavBody>
        <SideNavFooter>
          <SideNavItem
            leading={
              <Indicator
                emphasis="intense"
                color="positive"
                accessibilityLabel="Positive Indicator"
              />
            }
            title="Test Mode"
            trailing={<Switch accessibilityLabel="Test Mode" />}
          />
        </SideNavFooter>
      </SideNav>
    </MemoryRouter>
  );
};

const SideNavL4NestingErrorExample = (): React.ReactElement => {
  return (
    <MemoryRouter initialEntries={['/four']}>
      <SideNav>
        <SideNavBody>
          <NavLink href="/" title="Home L1">
            <SideNavLevel>
              <NavLink href="/two" title="Home L2">
                <SideNavLevel>
                  <NavLink href="/three" title="Home L3">
                    <SideNavLevel>
                      <NavLink href="/four" title="Home L4" />
                    </SideNavLevel>
                  </NavLink>
                </SideNavLevel>
              </NavLink>
            </SideNavLevel>
          </NavLink>
        </SideNavBody>
      </SideNav>
    </MemoryRouter>
  );
};

export { SideNavExample, SideNavL4NestingErrorExample };
