import dedent from 'dedent';

export const bottomNavWithReactRouter = {
  'App.tsx': dedent`import React from 'react';
  import { BrowserRouter } from 'react-router-dom';
  import { AllRoutes, BottomNavExample } from './BottomNavExample';
  
  const App = () => {
    return (
      <BrowserRouter>
        <BottomNavExample />
        <AllRoutes />
      </BrowserRouter>
    );
  };

  export default App;
  `,
  'BottomNavExample.tsx': dedent`import React from 'react';
  import {
    matchPath,
    useLocation,
    NavLink,
    Routes,
    Route,
  } from 'react-router-dom';
  import {
    Box,
    BottomNav,
    BottomNavItem,
    BottomNavItemProps
  } from '@razorpay/blade/components';
  import { bottomNavItems } from './bottomNavItems';


  const SamplePage = ({ match }: { match: any }): React.ReactElement => (
    <Box padding={{ base: 'spacing.2', m: 'spacing.6' }}>
      <pre>
        <code>{JSON.stringify(match, null, 4)}</code>
      </pre>
    </Box>
  );

  /**
   * Returns if the given href or one of the items from activeOnLinks are active
   */ 
  const isItemActive = (
    location: { pathname: string },
    { href, activeOnLinks }: { href?: string; activeOnLinks?: string[] }
  ): boolean => {
    const isCurrentPathActive = Boolean(matchPath(location.pathname, href ?? ''));

    const isSubItemActive = Boolean(
      activeOnLinks?.find((href) => matchPath(location.pathname, href))
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
        as={NavLink}
        isActive={isItemActive(location, { href: props.href, activeOnLinks: props.activeOnLinks })}
      />
    );
  };

  export const AllRoutes = () => {
    return (
      <Routes>
        {Object.values(bottomNavItems).map((route) => (
          <Route key={route.href} path={route.href} element={<SamplePage match={{ route }} />} />
        ))}
      </Routes>
    )
  }

  export const BottomNavExample = () => {
    return (
      <BottomNav>
        {bottomNavItems.map((item, index) => (
          <BottomNavRouterItem key={index} {...item} />
        ))}
      </BottomNav>
    )
  }
  `,
  'bottomNavItems.ts': dedent`import {
    PaymentGatewayIcon,
    TransactionsIcon,
    PaymentLinkIcon,
    PaymentPagesIcon,
    PaymentButtonIcon,
  } from '@razorpay/blade/components';

  export const bottomNavItems = [
    {
      title: 'Payments',
      href: '/',
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
    {
      title: 'Pages',
      href: '/payment-pages',
      icon: PaymentPagesIcon,
    },
    {
      title: 'Buttons',
      href: '/payment-buttons',
      icon: PaymentButtonIcon,
    },
  ] as const;
  `,
};
