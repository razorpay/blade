import { Link, MemoryRouter, useLocation, matchPath } from 'react-router-dom';
import { BottomNavItem, BottomNav } from '../index';
import type { BottomNavItemProps, BottomNavProps } from '../index';
import {
  MenuDotsIcon,
  PaymentGatewayIcon,
  PaymentLinkIcon,
  TransactionsIcon,
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

const BottomNavRouterItem = (
  props: Omit<BottomNavItemProps, 'as'> & {
    activeOnLinks?: string[];
  },
): React.ReactElement => {
  const location = useLocation();

  return (
    <BottomNavItem
      {...props}
      as={Link}
      isActive={isItemActive(location, { href: props.href, activeOnLinks: props.activeOnLinks })}
    />
  );
};

const bottomNavItems = [
  {
    title: 'Payments',
    href: '/payments',
    icon: PaymentGatewayIcon,
  },
  {
    title: 'Transactions',
    href: '/transactions',
    icon: TransactionsIcon,
  },
  {
    title: 'Links',
    href: '/payment-links',
    icon: PaymentLinkIcon,
  },
];

const BottomNavExample = ({
  initialEntries = ['/payments'],
  moreClick,
  ...args
}: Omit<BottomNavProps, 'children'> & {
  initialEntries?: string[];
  moreClick?: () => void;
}): React.ReactElement => {
  return (
    <MemoryRouter initialEntries={initialEntries}>
      <BottomNav {...args}>
        {bottomNavItems.map((item, index) => (
          <BottomNavRouterItem key={index} {...item} />
        ))}
        <BottomNavItem title="More" icon={MenuDotsIcon} onClick={moreClick as never} />
      </BottomNav>
    </MemoryRouter>
  );
};

export { BottomNavExample };
