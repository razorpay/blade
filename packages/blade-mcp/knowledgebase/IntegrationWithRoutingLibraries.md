## Routing Libraries

This guide will help you integrate blade navigation components like `Link`, `Button`, `Tabs`, `Breadcrumbs`, etc with routing libraries like `react-router`, `@reach/router`, etc.

### Codesandbox URLs:

1. https://codesandbox.io/s/blade-link-react-router-v5-rcrdn8
2. https://codesandbox.io/s/blade-link-react-router-v6-2w5f9k
3. https://codesandbox.io/s/blade-tab-react-router-v6-7g8nwc

### `Link` Example with `react-router v5`

*Codesandbox URL:* https://codesandbox.io/s/blade-link-react-router-v5-rcrdn8

In this example, we enhanced our `Link` component to work with react-router v5 by using the `onClick` prop to handle the navigation.

```tsx
// Implementation: BladeRouterLink.tsx (react-router-v5)
import React from "react";
import { Link as BladeLink } from "@razorpay/blade/components";
import { Link as ReactRouterLink } from "react-router-dom"; // v5
import type { LinkProps as RouterLinkProps } from "react-router-dom";
import type { LinkProps as BladeLinkProps } from "@razorpay/blade/components";

type EnhancedRouterProps = BladeLinkProps &
  RouterLinkProps & {
    navigate: () => void;
  };

const EnhancedRouterLink = React.forwardRef<
  HTMLAnchorElement,
  EnhancedRouterProps
>(({ children, navigate, href, target, onClick, ...props }, ref) => {
  const handleClick = (event: React.MouseEvent): void => {
    onClick?.(event as never);
    const onClickPreventDefaulted = event.defaultPrevented;
    // ignore everything but left clicks
    const isLeftClick = event.button === 0;
    // let browser handle "target=_blank" etc.
    const isTargetSelf = !target || target === "_self";
    const isModifierKey =
      event.metaKey || event.altKey || event.ctrlKey || event.shiftKey;

    if (
      !onClickPreventDefaulted &&
      isLeftClick &&
      isTargetSelf &&
      !isModifierKey
    ) {
      event.preventDefault();
      navigate();
    }
  };

  return (
    // @ts-expect-error - no overlap between BladeLink types and RouterLinkProps
    <BladeLink
      ref={ref}
      href={href}
      {...props}
      onClick={(event) => {
        handleClick(event as never);
      }}
    >
      {children as string}
    </BladeLink>
  );
});

const BladeRouterLinkV5 = (
  props: BladeLinkProps &
    Omit<RouterLinkProps, keyof React.AnchorHTMLAttributes<HTMLAnchorElement>>
): React.ReactElement => {
  return <ReactRouterLink component={EnhancedRouterLink} {...props} />;
};

export { BladeRouterLinkV5 };

// Usage: App.tsx
import { BladeProvider, Box } from "@razorpay/blade/components";
import { bladeTheme } from "@razorpay/blade/tokens";
import { BrowserRouter, Route } from "react-router-dom"; // v5
import { BladeRouterLinkV5 } from "./BladeRouterLink";

const Example = () => {
  return (
    <Box display="flex" flexDirection="column" gap="spacing.2">
      <BladeRouterLinkV5 color="primary" to="/">
        Home
      </BladeRouterLinkV5>
      <BladeRouterLinkV5 color="primary" to="/dashboard">
        Dashboard
      </BladeRouterLinkV5>

      <Route path="/" exact>
        <p>Home page</p>
      </Route>
      <Route path="/dashboard" exact>
        <p>Dashboard page</p>
      </Route>
    </Box>
  );
};

export default function App() {
  return (
    <BladeProvider themeTokens={bladeTheme}>
      <BrowserRouter>
        <Example />
      </BrowserRouter>
    </BladeProvider>
  );
}
```


### `Link` Example with `react-router v6`

*Codesandbox URL:* https://codesandbox.io/s/blade-link-react-router-v6-2w5f9k

In v6 it's significantly easier to integrate with the help of `useHref` and `useLinkClickHandler` hooks provided by `react-router`.

```tsx
// Implementation: BladeRouterLink.tsx (react-router-v6)
import React from "react";
import { Link as BladeLink } from "@razorpay/blade/components";
import {
  Link as ReactRouterLink,
  useHref,
  useLinkClickHandler,
} from "react-router-dom"; // v6
import type { LinkProps as RouterLinkProps } from "react-router-dom"; // v6
import type { LinkProps as BladeLinkProps } from "@razorpay/blade/components";

const BladeRouterLinkV6 = React.forwardRef<
  HTMLAnchorElement,
  BladeLinkProps &
    Omit<RouterLinkProps, keyof React.AnchorHTMLAttributes<HTMLAnchorElement>>
>(({ onClick, replace = false, state, target, to, ...rest }, ref) => {
  let href = useHref(to);
  let handleClick = useLinkClickHandler(to, {
    replace,
    state,
    target,
  });

  return (
    // @ts-expect-error no overlap between react router vs blade link types
    <BladeLink
      {...rest}
      href={href}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) {
          handleClick(event as never);
        }
      }}
      ref={ref}
      target={target}
    />
  );
});

export { BladeRouterLinkV6 };

// Usage: App.tsx
import { BladeProvider, Box } from "@razorpay/blade/components";
import { bladeTheme } from "@razorpay/blade/tokens";
import { Routes, BrowserRouter, Route } from "react-router-dom";
import { BladeRouterLinkV6 } from "./BladeRouterLink";

const Example = () => {
  return (
    <Box display="flex" flexDirection="column" gap="spacing.2">
      <BladeRouterLinkV6 color="primary" to="/">
        Home
      </BladeRouterLinkV6>
      <BladeRouterLinkV6 color="primary" to="/dashboard">
        Dashboard
      </BladeRouterLinkV6>

      <Routes>
        <Route index element={<p>Home page</p>} />
        <Route path="dashboard" element={<p>Dashboard page</p>} />
      </Routes>
    </Box>
  );
};

export default function App() {
  return (
    <BladeProvider themeTokens={bladeTheme}>
      <BrowserRouter>
        <Example />
      </BrowserRouter>
    </BladeProvider>
  );
}
```


### `Tabs` Example with `react-router v6`

*Codesandbox URL:* https://codesandbox.io/s/blade-tab-react-router-v6-7g8nwc

In this example, we enhanced our `TabItem` component to work with react-router v6 by using the `useHref` hook to get the href and `useLinkClickHandler` hook to handle the navigation.

```tsx
// Implementation: TabItemRouterLink.tsx
import React from "react";
import { TabItem } from "@razorpay/blade/components";
import { useHref, useLinkClickHandler } from "react-router-dom";
import type { LinkProps as RouterLinkProps } from "react-router-dom"; // v6
import type { TabItemProps } from "@razorpay/blade/components";

const TabItemRouterLink = ({
  onClick,
  replace = false,
  state,
  to,
  ...rest
}: TabItemProps &
  Omit<
    RouterLinkProps,
    keyof React.AnchorHTMLAttributes<HTMLAnchorElement>
  >) => {
  let href = useHref(to);
  let handleClick = useLinkClickHandler(to, {
    replace,
    state,
  });

  return (
    <TabItem
      {...rest}
      href={href}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) {
          handleClick(event as never);
        }
      }}
    />
  );
};

export { TabItemRouterLink };

// Usage: App.tsx
import {
  BladeProvider,
  Box,
  Tabs,
  TabList,
  TabItem,
  TabPanel,
  Text,
} from "@razorpay/blade/components";
import { bladeTheme } from "@razorpay/blade/tokens";
import { BrowserRouter, useMatch } from "react-router-dom";
import { TabItemRouterLink } from "./TabItemLink";

const Example = () => {
  const match = useMatch({
    path: "/accounts/:id",
  });
  const selectedPath = match?.params?.id;
  return (
    <Box display="flex" flexDirection="column" gap="spacing.2">
      <Tabs value={selectedPath}>
        <TabList marginX="spacing.6">
          <TabItemRouterLink value="subscriptions" to="/accounts/subscriptions">
            Subscription
          </TabItemRouterLink>
          <TabItemRouterLink value="plans" to="/accounts/plans">
            Plans
          </TabItemRouterLink>
          <TabItemRouterLink value="settings" to="/accounts/settings">
            Settings
          </TabItemRouterLink>
        </TabList>

        <Box paddingX="spacing.6" paddingBottom="spacing.6">
          <TabPanel value="subscriptions">
            <Text>Subscription panel</Text>
          </TabPanel>
          <TabPanel value="plans">
            <Text>Plans panel</Text>
          </TabPanel>
          <TabPanel value="settings">
            <Text>Settings panel</Text>
          </TabPanel>
        </Box>
      </Tabs>
    </Box>
  );
};

export default function App() {
  return (
    <BladeProvider themeTokens={bladeTheme}>
      <BrowserRouter>
        <Example />
      </BrowserRouter>
    </BladeProvider>
  );
}
```

