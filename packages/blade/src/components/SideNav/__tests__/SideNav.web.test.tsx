import userEvents from '@testing-library/user-event';
import { Link, MemoryRouter, useLocation, matchPath } from 'react-router-dom';
import { waitFor } from '@testing-library/react';
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
import renderWithTheme from '~utils/testing/renderWithTheme.web';
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
            leading={<Indicator color="positive" accessibilityLabel="" />}
            title="Test Mode"
            trailing={<Switch accessibilityLabel="" />}
          />
        </SideNavFooter>
      </SideNav>
    </MemoryRouter>
  );
};

describe('SideNav', () => {
  test('should render', () => {
    const { container } = renderWithTheme(<SideNavExample />);
    expect(container).toMatchSnapshot();
  });

  test('should supports styled-props', () => {
    const { getByRole } = renderWithTheme(
      // Have to pass display="block" otherwise component ignores media query style and selects base display value which is none
      <SideNavExample position="absolute" zIndex={1234} display="block" />,
    );
    expect(getByRole('navigation')).toHaveStyle('z-index: 1234; position: absolute');
  });

  test('should open L2 and L3', async () => {
    const user = userEvents.setup();
    const { getByRole } = renderWithTheme(<SideNavExample display="block" />, {
      container: document.body,
    });

    // Open L2
    await user.click(getByRole('link', { name: 'L2 Trigger' }));
    await waitFor(() => expect(getByRole('link', { name: 'L2 Item' })).toBeVisible());

    // Select L2 Item
    expect(getByRole('link', { name: 'L2 Item' })).toHaveAttribute('aria-current', 'page');
    await user.click(getByRole('link', { name: 'L2 Item 2' }));
    expect(getByRole('link', { name: 'L2 Item 2' })).toHaveAttribute('aria-current', 'page');

    // Open L3
    await user.click(getByRole('button', { name: 'L3 Trigger' }));
    await waitFor(() => expect(getByRole('link', { name: 'L3 Item 2' })).toBeVisible());

    // Select L3 Item
    await user.click(getByRole('link', { name: 'L3 Item 2' }));
    expect(getByRole('link', { name: 'L3 Item 2' })).toHaveAttribute('aria-current', 'page');
  });

  test('should keep L3 Item selected based on URL', () => {
    const { getByRole } = renderWithTheme(
      <SideNavExample display="block" initialEntries={['/l3-item']} />,
      {
        container: document.body,
      },
    );
    expect(getByRole('link', { name: 'L3 Item' })).toHaveAttribute('aria-current', 'page');
  });
});
