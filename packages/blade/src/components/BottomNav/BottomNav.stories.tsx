import React from 'react';
import type { StoryFn, Meta } from '@storybook/react';
import { Title } from '@storybook/addon-docs';
import StoryRouter from 'storybook-react-router';
import { NavLink, matchPath, Route, Switch, useLocation } from 'react-router-dom';
import { bottomNavWithReactRouter } from './docsCode';
import { BottomNav, BottomNavItem } from '.';
import type { BottomNavItemProps, BottomNavProps } from '.';
import { Sandbox } from '~utils/storybook/Sandbox';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';
import type { SideNavLinkProps } from '~components/SideNav';
import { SideNav, SideNavBody, SideNavLink } from '~components/SideNav';
import {
  CurrentAccountIcon,
  HomeIcon,
  MenuDotsIcon,
  PaymentButtonIcon,
  PaymentGatewayIcon,
  PaymentLinkIcon,
  PaymentPagesIcon,
  RazorpayIcon,
  TransactionsIcon,
} from '~components/Icons';
import { Box } from '~components/Box';
import { Heading } from '~components/Typography';
import { Alert } from '~components/Alert';

const Page = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      componentName="BottomNav"
      componentDescription="Bottom navigation component is a persistent user interface element at the bottom of a mobile app screen, providing quick access to core functionalities through icons and labels."
      figmaURL="https://www.figma.com/proto/jubmQL9Z8V7881ayUD95ps/Blade-DSL?node-id=96508-47113&node-type=frame&m=dev&scaling=min-zoom&content-scaling=fixed&page-id=91244%3A54900"
    >
      <Title>Usage (with React Router v6)</Title>
      <Alert
        color="notice"
        title="State Management Note"
        description="BottomNav component requires you to handle active link and active menu item on consumer end
        since the component is detached from React Router. The example below includes some boilerplate in handling these active states using React Router v6. Make sure to test your edge cases while implementing. Checkout API Decision of BottomNav for more details."
        isFullWidth
        isDismissible={false}
      />

      <Sandbox
        files={bottomNavWithReactRouter}
        editorHeight={600}
        hideNavigation={false}
        openFile="App.tsx,bottomNavItems.ts,BottomNavExample.tsx"
      />
    </StoryPageWrapper>
  );
};

export default {
  title: 'Components/BottomNav',
  component: BottomNav,
  tags: ['autodocs'],
  argTypes: getStyledPropsArgTypes(),
  parameters: {
    viewport: {
      defaultViewport: 'iPhone6',
    },
    docs: {
      page: Page,
    },
  },
  // eslint-disable-next-line babel/new-cap
  decorators: [StoryRouter(undefined, { initialEntries: ['/payments'] })] as unknown,
} as Meta<typeof BottomNav>;

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
    isActive: true,
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
];

const sideNavItems = [
  {
    title: 'Home',
    href: '/home',
    icon: HomeIcon,
  },
  {
    title: 'Current Account',
    href: '/x/current-account',
    icon: CurrentAccountIcon,
  },
  {
    title: 'Rize',
    href: '/rize',
    icon: RazorpayIcon,
  },
];

// eslint-disable-next-line
const SamplePage = ({ match }: { match: any }): React.ReactElement => (
  <Box padding={{ base: 'spacing.2', m: 'spacing.6' }}>
    <pre>
      <code>{JSON.stringify(match, null, 4)}</code>
    </pre>
  </Box>
);

const isItemActive = (
  location: { pathname: string },
  { href, activeOnLinks }: { href?: string; activeOnLinks?: string[] },
): boolean => {
  const isCurrentPathActive = Boolean(
    matchPath(location.pathname, {
      path: href,
      exact: true,
    }),
  );

  const isSubItemActive = Boolean(
    activeOnLinks?.find((href) => matchPath(location.pathname, { path: href, exact: true })),
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

const SideNavRouterLink = (
  props: Omit<SideNavLinkProps, 'as'> & {
    activeOnLinks?: string[];
  },
): React.ReactElement => {
  const location = useLocation();

  return (
    <SideNavLink
      {...props}
      as={NavLink}
      isActive={isItemActive(location, { href: props.href, activeOnLinks: props.activeOnLinks })}
    />
  );
};

const BottomNavTemplate: StoryFn<BottomNavProps> = ({ children, ...args }) => {
  return (
    <BottomNav {...args}>
      {bottomNavItems.map((item, index) => (
        <BottomNavItem key={index} {...item} />
      ))}
    </BottomNav>
  );
};

const WithRoutingTemplate: StoryFn<BottomNavProps> = ({ children, ...args }) => {
  const [isSideNavOpen, setIsSideNavOpen] = React.useState(false);
  return (
    <>
      <Switch>
        {[...Object.values(bottomNavItems), ...Object.values(sideNavItems)].map((route) => (
          <Route key={route.href} path={route.href} component={SamplePage} />
        ))}
      </Switch>
      <SideNav
        display={{ base: 'block', m: 'none' }}
        isOpen={isSideNavOpen}
        onDismiss={() => setIsSideNavOpen(false)}
        position="absolute"
      >
        <SideNavBody>
          {sideNavItems.map((item) => (
            <SideNavRouterLink key={item.title} {...item} />
          ))}
        </SideNavBody>
      </SideNav>
      <BottomNav {...args}>
        {children ?? (
          <>
            {bottomNavItems.slice(0, -1).map((item, index) => (
              <BottomNavRouterItem key={index} {...item} />
            ))}
            <BottomNavRouterItem
              title="More"
              onClick={() => setIsSideNavOpen(true)}
              icon={MenuDotsIcon}
              activeOnLinks={Object.values(sideNavItems).map((item) => item.href)}
            />
          </>
        )}
      </BottomNav>
    </>
  );
};

export const SimpleBottomNav = BottomNavTemplate.bind({});
SimpleBottomNav.args = {};

export const WithRouting = WithRoutingTemplate.bind({});
WithRouting.args = {};

export const ItemsCount = (): React.ReactElement => {
  return (
    <Box display="flex" flexDirection="column" gap="spacing.10">
      <Box>
        <Heading>2 Items</Heading>
        <BottomNav position="relative">
          {bottomNavItems.slice(0, 2).map((item, index) => (
            <BottomNavItem key={index} {...item} />
          ))}
        </BottomNav>
      </Box>
      <Box>
        <Heading>3 Items</Heading>
        <BottomNav position="relative">
          {bottomNavItems.slice(0, 3).map((item, index) => (
            <BottomNavItem key={index} {...item} />
          ))}
        </BottomNav>
      </Box>
      <Box>
        <Heading>4 Items</Heading>
        <BottomNav position="relative">
          {bottomNavItems.slice(0, 4).map((item, index) => (
            <BottomNavItem key={index} {...item} />
          ))}
        </BottomNav>
      </Box>
      <Box>
        <Heading>Max Items</Heading>
        <BottomNav position="relative">
          {bottomNavItems.map((item, index) => (
            <BottomNavItem key={index} {...item} />
          ))}
        </BottomNav>
      </Box>
    </Box>
  );
};
