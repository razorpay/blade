import dedent from 'dedent';

export const topNavFullExample = {
  'App.js': dedent`import React from 'react';
  import { BrowserRouter } from 'react-router-dom';
  import { TopNavExample } from './TopNavExample';
  
  const App = () => {
    return (
      <BrowserRouter>
        <TopNavExample />
      </BrowserRouter>
    );
  };

  export default App;
  `,
  'TopNavExample.js': dedent`import React from "react";
  import styled from "styled-components";
  import { Link, useLocation, useNavigate } from "react-router-dom";
  import { SideNavExample } from "./SideNavExample";
  import { isItemActive, RazorpayLogo } from "./utils";
  import {
    Box,
    Text,
    Heading,
    TopNav,
    TopNavBrand,
    TopNavContent,
    TopNavActions,
    TabNav,
    TabNavItem,
    TabNavItems,
    Menu,
    MenuItem,
    MenuOverlay,
    MenuHeader,
    MenuFooter,
    Badge,
    useTheme,
    HomeIcon,
    Button,
    Link as BladeLink,
    SearchInput,
    Avatar,
    Tooltip,
    ActivityIcon,
    AnnouncementIcon,
    ChevronDownIcon,
    ChevronRightIcon,
    RazorpayxPayrollIcon,
    List,
    ListItem,
    AcceptPaymentsIcon,
    MagicCheckoutIcon,
    AwardIcon,
    SIDE_NAV_EXPANDED_L1_WIDTH_BASE,
    SIDE_NAV_EXPANDED_L1_WIDTH_XL,
  } from "@razorpay/blade/components";
  import { makeSize } from "@razorpay/blade/utils";


  const TabNavItemLink = React.forwardRef((props, ref) => {
    const location = useLocation();
    return (
      <TabNavItem
        ref={ref}
        {...props}
        as={Link}
        isActive={isItemActive(location, {
          href: props.href,
          activeOnLinks: props.activeOnLinks,
        })}
      />
    );
  });

  const ExploreItem = ({
    icon: Icon,
    title,
    description,
  }) => {
    return (
      <Box display="flex" gap="spacing.4">
        <Box
          borderRadius="medium"
          padding="spacing.5"
          backgroundColor="surface.background.gray.subtle"
        >
          <Icon color="interactive.icon.neutral.subtle" size="medium" />
        </Box>
        <Box>
          <Text color="surface.text.gray.subtle" size="medium" weight="semibold">
            {title}
          </Text>
          <Text size="small" color="surface.text.gray.muted">
            {description}
          </Text>
        </Box>
      </Box>
    );
  };

  const DashboardBackground = styled.div(() => {
    return {
      height: "100vh",
      background:
        "radial-gradient(94.74% 64.44% at 29.03% 15.17%, #FFFFFF 0%, #90A5BB 100%)",
    };
  });

  const TopNavExample = () => {
    const { platform } = useTheme();
    const navigate = useNavigate();
    const isMobile = platform === "onMobile";
    const [isSideBarOpen, setIsSideBarOpen] = React.useState(false);
    const [selectedProduct, setSelectedProduct] = React.useState(
      null
    );

    const activeUrl = useLocation().pathname;
    React.useEffect(() => {
      setSelectedProduct(activeUrl);
    }, [activeUrl]);

    return (
      <DashboardBackground>
        <Box backgroundColor="surface.background.gray.subtle">
          <TopNav>
            {isMobile ? (
              <>
                <BladeLink icon={HomeIcon} size="medium" href="/home">
                  Home
                </BladeLink>
                <Heading textAlign="center" size="small" weight="semibold">
                  Payments
                </Heading>
                <Menu openInteraction="click">
                  <Avatar size="medium" name="Anurag Hazra" />
                  <MenuOverlay>
                    <MenuHeader title="Profile" />
                    <Box
                      display="flex"
                      gap="spacing.4"
                      padding="spacing.4"
                      alignItems="center"
                    >
                      <Avatar size="medium" name="John Doe" />
                      <Box display="flex" flexDirection="column" gap="spacing.2">
                        <Text size="medium" weight="semibold">
                          John Doe
                        </Text>
                        <Text size="xsmall" color="surface.text.gray.muted">
                          Razorpay Trusted Merchant
                        </Text>
                      </Box>
                    </Box>
                    <MenuItem>
                      <Text color="surface.text.gray.subtle">Settings</Text>
                    </MenuItem>
                    <MenuItem color="negative">
                      <Text color="feedback.text.negative.intense">Logout</Text>
                    </MenuItem>
                  </MenuOverlay>
                </Menu>
              </>
            ) : (
              <>
                <TopNavBrand>
                  <RazorpayLogo />
                </TopNavBrand>
                <TopNavContent>
                  <TabNav
                    items={[
                      { title: "Home", href: "/home", icon: HomeIcon },
                      {
                        href: "/payroll",
                        title: "Payroll",
                        icon: RazorpayxPayrollIcon,
                        description: "Automate payroll with ease.",
                      },
                      {
                        href: "/payments",
                        title: "Payments",
                        icon: AcceptPaymentsIcon,
                        description: "Manage payments effortlessly.",
                      },
                      {
                        href: "/magic-checkout",
                        title: "Magic Checkout",
                        icon: MagicCheckoutIcon,
                        description: "Fast, one-click checkout.",
                      },
                      {
                        href: "/rize",
                        title: "Rize",
                        icon: AwardIcon,
                        isAlwaysOverflowing: true,
                        description: "Boost your business growth.",
                      },
                    ]}
                  >
                    {({ items, overflowingItems }) => {
                      const activeProduct = overflowingItems.find(
                        (item) => item.href === selectedProduct
                      );
                      return (
                        <>
                          <TabNavItems>
                            {items.map((item) => {
                              return (
                                <TabNavItemLink
                                  key={item.title}
                                  title={item.title}
                                  href={item.href}
                                  icon={item.icon}
                                />
                              );
                            })}
                          </TabNavItems>
                          {overflowingItems.length ? (
                            <Menu openInteraction="hover">
                              <TabNavItem
                                title={
                                  activeProduct
                                    ? \`More: $\{activeProduct.title}\`
                                    : "More"
                                }
                                trailing={<ChevronDownIcon />}
                                isActive={Boolean(activeProduct)}
                              />
                              <MenuOverlay>
                                <MenuHeader
                                  title="Products for you"
                                  trailing={
                                    <Badge emphasis="subtle" color="notice">
                                      Recommended
                                    </Badge>
                                  }
                                />
                                {overflowingItems.map((item) => {
                                  return (
                                    <MenuItem
                                      key={item.href}
                                      onClick={() => {
                                        navigate(item.href);
                                        setSelectedProduct(item.href);
                                      }}
                                    >
                                      <ExploreItem
                                        icon={item.icon}
                                        title={item.title}
                                        description={item.description}
                                      />
                                    </MenuItem>
                                  );
                                })}
                                <MenuFooter>
                                  <BladeLink
                                    href=""
                                    icon={ChevronRightIcon}
                                    iconPosition="right"
                                  >
                                    View all products
                                  </BladeLink>
                                </MenuFooter>
                              </MenuOverlay>
                            </Menu>
                          ) : null}
                        </>
                      );
                    }}
                  </TabNav>
                </TopNavContent>
                <TopNavActions>
                  <SearchInput
                    placeholder="Search in payments"
                    accessibilityLabel="Search Across Razorpay"
                  />
                  <Tooltip content="View Ecosystem Health">
                    <Button
                      size={isMobile ? "small" : "medium"}
                      variant="tertiary"
                      icon={ActivityIcon}
                    />
                  </Tooltip>
                  <Tooltip content="View Announcements">
                    <Button
                      size={isMobile ? "small" : "medium"}
                      variant="tertiary"
                      icon={AnnouncementIcon}
                    />
                  </Tooltip>
                  <Menu openInteraction="click">
                    <Avatar size="medium" name="Anurag Hazra" />
                    <MenuOverlay>
                      <MenuHeader title="Profile" />
                      <Box
                        display="flex"
                        gap="spacing.4"
                        padding="spacing.4"
                        alignItems="center"
                      >
                        <Avatar size="medium" name="John Doe" />
                        <Box
                          display="flex"
                          flexDirection="column"
                          gap="spacing.2"
                        >
                          <Text size="medium" weight="semibold">
                            John Doe
                          </Text>
                          <Text size="xsmall" color="surface.text.gray.muted">
                            Razorpay Trusted Merchant
                          </Text>
                        </Box>
                      </Box>
                      <MenuItem>
                        <Text color="surface.text.gray.subtle">Settings</Text>
                      </MenuItem>
                      <MenuItem color="negative">
                        <Text color="feedback.text.negative.intense">Logout</Text>
                      </MenuItem>
                    </MenuOverlay>
                  </Menu>
                </TopNavActions>
              </>
            )}
          </TopNav>
          <Box
            overflow="hidden"
            position="relative"
            borderRadius="large"
            borderTopRightRadius="none"
            borderBottomLeftRadius="none"
            borderBottomRightRadius="none"
            height="100%"
            marginX={{ base: "spacing.0", m: "spacing.3" }}
          >
            <SideNavExample
              isOpen={isSideBarOpen}
              onDismiss={() => {
                setIsSideBarOpen(false);
              }}
            />
            <Box
              marginLeft={{
                base: "100%",
                m: makeSize(SIDE_NAV_EXPANDED_L1_WIDTH_BASE),
                xl: makeSize(SIDE_NAV_EXPANDED_L1_WIDTH_XL),
              }}
              // 100vh - (topnav height [56px] + border [2px])
              height="calc(100vh - 58px)"
            >
              <Box
                height="100vh"
                padding="spacing.5"
                overflowY="scroll"
                backgroundColor="surface.background.gray.moderate"
              >
                <Box width={{ base: "max-content", m: "100%" }} height="200vh">
                  <Text marginBottom="spacing.4">This demo integrates:</Text>
                  <List>
                    <ListItem>SideNav</ListItem>
                    <ListItem>Menu (Explore Tab)</ListItem>
                    <ListItem>ReactRouter</ListItem>
                    <ListItem>Mobile Responsiveness</ListItem>
                    <ListItem>One Dashboard Layout</ListItem>
                  </List>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </DashboardBackground>
    );
  };

  export { TopNavExample };
  `,
  'SideNavExample.js': dedent`import React from "react";
  import { Link, useLocation } from "react-router-dom";
  import { isItemActive } from "./utils";
  import {
    SideNav,
    SideNavBody,
    SideNavLevel,
    SideNavLink,
    SideNavSection,
    HomeIcon,
    LayoutIcon,
    PaymentButtonIcon,
    PaymentGatewayIcon,
    PaymentLinkIcon,
    PaymentPagesIcon,
  } from "@razorpay/blade/components";

  const NavLink = (
    props
  ) => {
    const location = useLocation();

    return (
      <SideNavLink
        {...props}
        as={Link}
        isActive={isItemActive(location, {
          href: props.href,
          activeOnLinks: props.activeOnLinks,
        })}
      />
    );
  };

  const SideNavExample = ({
    isOpen,
    onDismiss,
  }) => {
    return (
      <SideNav isOpen={isOpen} onDismiss={onDismiss} position="absolute">
        <SideNavBody>
          <NavLink icon={HomeIcon} title="Home" href="/home" />
          <NavLink
            icon={LayoutIcon}
            title="L2 Trigger"
            href="/l2-item"
            activeOnLinks={["/l2-item", "/l2-item-2", "/l3-item", "/l3-item-2"]}
          >
            <SideNavLevel>
              <NavLink title="L2 Item" href="/l2-item" />
              <NavLink title="L2 Item 2" href="/l2-item-2" />
              <NavLink
                title="L3 Trigger"
                activeOnLinks={["/l3-item", "/l3-item-2"]}
              >
                <SideNavLevel>
                  <NavLink title="L3 Item" href="/l3-item" />
                  <NavLink title="L3 Item 2" href="/l3-item-2" />
                </SideNavLevel>
              </NavLink>
            </SideNavLevel>
          </NavLink>

          <SideNavSection title="Products" maxVisibleItems={2}>
            <NavLink icon={PaymentGatewayIcon} title="Gateway" href="/gateway" />
            <NavLink icon={PaymentLinkIcon} title="Links" href="/links" />
            <NavLink icon={PaymentPagesIcon} title="Pages" href="/pages" />
            <NavLink icon={PaymentButtonIcon} title="Button" href="/button" />
          </SideNavSection>
        </SideNavBody>
      </SideNav>
    );
  };

  export { SideNavExample };
`,
  'utils.js': dedent`import React from 'react';
  import { matchPath } from "react-router-dom";

  const isItemActive = (
    location,
    { href, activeOnLinks }
  ) => {
    const isCurrentPathActive = Boolean(matchPath(location.pathname, href));

    const isSubItemActive = Boolean(
      activeOnLinks?.find((href) => matchPath(location.pathname, href))
    );

    return isCurrentPathActive || isSubItemActive;
  };

  const RazorpayLogo = () => {
    return (
      <svg
        width="116"
        height="24"
        viewBox="0 0 116 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="logo">
          <path
            id="Vector"
            d="M7.49374 6.48973L6.53128 10.0322L12.0402 6.46956L8.43726 19.9123L12.0964 19.9153L17.419 0.0598755"
            fill="#3395FF"
          />
          <path
            id="Vector_2"
            d="M1.56438 14.264L0.0488892 19.9153H7.54876L10.6176 8.41895L1.56438 14.264ZM27.6162 9.28853C27.4329 9.96989 27.0797 10.4704 26.5529 10.79C26.0274 11.109 25.2898 11.2691 24.3378 11.2691H21.3129L22.3749 7.30922H25.3998C26.3507 7.30922 27.0039 7.4681 27.3584 7.79198C27.7128 8.11585 27.7983 8.61083 27.6162 9.29525V9.28853ZM30.7481 9.2097C31.133 7.77976 30.9742 6.6798 30.2702 5.90983C29.5674 5.14597 28.3343 4.76099 26.5743 4.76099H19.8237L15.7599 19.9221H19.0396L20.6773 13.8112H22.8284C23.3111 13.8112 23.6912 13.8906 23.9687 14.0434C24.2467 14.2023 24.4099 14.4773 24.46 14.8745L25.0454 19.9221H28.5591L27.9896 15.2167C27.8735 14.1656 27.3926 13.5484 26.5474 13.3651C27.6248 13.0534 28.5274 12.534 29.2546 11.8129C29.9767 11.0971 30.4926 10.2 30.7481 9.21581V9.2097ZM38.7203 14.4956C38.4453 15.5222 38.0237 16.2983 37.4535 16.8422C36.8828 17.386 36.2008 17.6549 35.4052 17.6549C34.5949 17.6549 34.0455 17.3922 33.7552 16.8605C33.4643 16.3289 33.4546 15.5589 33.7247 14.5506C33.9948 13.5423 34.4256 12.754 35.0183 12.1857C35.6111 11.6174 36.3041 11.3332 37.0997 11.3332C37.8941 11.3332 38.438 11.6082 38.713 12.1539C38.9941 12.7021 39.0002 13.4861 38.7252 14.5066L38.7203 14.4956ZM40.1576 9.13026L39.7469 10.6641C39.5697 10.1141 39.2257 9.67412 38.7172 9.34414C38.2076 9.02026 37.577 8.85527 36.8247 8.85527C35.902 8.85527 35.0159 9.09359 34.1665 9.57024C33.3171 10.0469 32.5715 10.7191 31.936 11.5868C31.3005 12.4546 30.8361 13.4384 30.5366 14.5445C30.2433 15.6567 30.1822 16.6283 30.3594 17.4716C30.5427 18.321 30.9277 18.9688 31.5205 19.421C32.1193 19.8793 32.8832 20.1054 33.8182 20.1054C34.5611 20.1091 35.2957 19.9485 35.9692 19.6348C36.6351 19.3345 37.2274 18.8924 37.7047 18.3393L37.2769 19.9379H40.4485L43.3444 9.13576H40.1667L40.1576 9.13026ZM54.7412 9.13026H45.518L44.8733 11.5379H50.2399L43.1452 17.6671L42.539 19.9282H52.0597L52.7044 17.5205H46.9541L54.1576 11.2996L54.7412 9.13026ZM62.8595 14.4773C62.5741 15.5406 62.1506 16.3399 61.5914 16.8605C61.0323 17.386 60.3552 17.6488 59.5602 17.6488C57.898 17.6488 57.3517 16.5916 57.9188 14.4773C58.1999 13.4262 58.6252 12.6361 59.1935 12.1038C59.7619 11.5697 60.4505 11.3033 61.2602 11.3033C62.0546 11.3033 62.5912 11.5679 62.8674 12.1007C63.1436 12.6324 63.1412 13.425 62.8595 14.476V14.4773ZM64.7159 9.53663C63.9857 9.08198 63.0538 8.85466 61.9172 8.85466C60.7665 8.85466 59.7014 9.08076 58.7212 9.53296C57.7451 9.98234 56.8872 10.6531 56.2157 11.4921C55.5252 12.3415 55.0284 13.3376 54.7234 14.4742C54.424 15.6066 54.3873 16.6008 54.6196 17.452C54.8518 18.3014 55.3406 18.9553 56.0739 19.4075C56.8134 19.8634 57.7544 20.0901 58.9094 20.0901C60.046 20.0901 61.1032 19.8616 62.0748 19.4069C63.0464 18.9498 63.8775 18.3008 64.568 17.4453C65.2586 16.5935 65.7536 15.5998 66.0591 14.4632C66.3646 13.3266 66.4013 12.3342 66.1691 11.4811C65.9369 10.6317 65.4541 9.97783 64.7269 9.52257L64.7159 9.53663ZM76.0382 12.0158L76.8509 9.07648C76.5759 8.93593 76.2154 8.8626 75.7632 8.8626C75.036 8.8626 74.3393 9.04226 73.6671 9.40647C73.089 9.71568 72.5977 10.152 72.1822 10.6983L72.6038 9.11559L71.6829 9.11926H69.4219L66.507 19.9172H69.7232L71.2356 14.2726C71.4556 13.4519 71.8516 12.8059 72.423 12.3476C72.9913 11.8875 73.7001 11.6571 74.5557 11.6571C75.0812 11.6571 75.5701 11.7775 76.0345 12.0176L76.0382 12.0158ZM84.9869 14.5292C84.7119 15.5375 84.2964 16.3075 83.7281 16.8391C83.1598 17.3732 82.4753 17.6396 81.6809 17.6396C80.8865 17.6396 80.3426 17.3708 80.0554 16.833C79.7621 16.2922 79.756 15.5131 80.031 14.4889C80.306 13.4653 80.7276 12.6801 81.3082 12.1362C81.8887 11.588 82.5731 11.3143 83.3675 11.3143C84.1497 11.3143 84.6752 11.5954 84.9564 12.1637C85.2374 12.732 85.2436 13.5203 84.9735 14.5286L84.9869 14.5292ZM87.2223 9.55435C86.6264 9.0777 85.8656 8.83938 84.9429 8.83938C84.1344 8.83938 83.3639 9.02271 82.633 9.39302C81.9027 9.76273 81.31 10.2669 80.8547 10.9049L80.8657 10.8315L81.4053 9.11437H78.2643L77.4638 12.1026L77.4394 12.2065L74.1395 24.5162H77.3599L79.0221 18.3198C79.1871 18.871 79.5232 19.3036 80.0365 19.6165C80.5498 19.9282 81.1835 20.0828 81.937 20.0828C82.8719 20.0828 83.7641 19.8567 84.6105 19.4045C85.4599 18.951 86.1932 18.2984 86.8165 17.4551C87.4398 16.6118 87.9024 15.6341 88.1976 14.528C88.497 13.4201 88.5581 12.432 88.387 11.5673C88.2128 10.7014 87.8272 10.031 87.232 9.5568L87.2223 9.55435ZM97.9047 14.4852C97.6297 15.5057 97.208 16.2879 96.6397 16.8257C96.0714 17.3671 95.387 17.6366 94.5926 17.6366C93.7798 17.6366 93.2299 17.3738 92.9426 16.8422C92.6493 16.3105 92.6432 15.5406 92.9121 14.5323C93.181 13.524 93.61 12.7357 94.2027 12.1674C94.7955 11.599 95.489 11.3155 96.2847 11.3155C97.0791 11.3155 97.6169 11.5905 97.8979 12.1344C98.179 12.6801 98.1809 13.4641 97.9071 14.487L97.9047 14.4852ZM99.3407 9.11681L98.9295 10.6506C98.7523 10.0976 98.41 9.65763 97.9028 9.33069C97.3895 9.00437 96.7601 8.84182 96.0085 8.84182C95.0857 8.84182 94.1948 9.08015 93.3441 9.5568C92.4947 10.0334 91.7492 10.702 91.1137 11.5673C90.4781 12.4326 90.0137 13.4189 89.7143 14.5249C89.4179 15.6353 89.3598 16.6087 89.5371 17.4557C89.7161 18.299 90.1017 18.9504 90.6981 19.4051C91.2933 19.8573 92.0609 20.0858 92.9958 20.0858C93.7475 20.0858 94.4655 19.9294 95.1468 19.6153C95.8112 19.3135 96.4019 18.8709 96.878 18.3179L96.4503 19.9178H99.6218L102.517 9.11987H99.3456L99.3407 9.11681ZM115.832 9.12048L115.834 9.11742H113.885C113.822 9.11742 113.767 9.12048 113.71 9.1217H112.699L112.18 9.84278L112.051 10.0139L111.996 10.0994L107.887 15.8241L107.037 9.12048H103.671L105.376 19.3073L101.612 24.5199H104.967L105.878 23.2286C105.903 23.1908 105.926 23.159 105.957 23.1186L107.02 21.6093L107.051 21.5665L111.813 14.814L115.828 9.13087L115.834 9.1272H115.832V9.12048Z"
            fill="#192839"
          />
        </g>
      </svg>
    );
  };

  export { isItemActive, RazorpayLogo };
`,
};

export const tabNavExample = {
  'App.js': dedent`import React from 'react';
  import { 
    Box, 
    TabNav, 
    TabNavItem,
    TabNavItems,
    Text,
    HomeIcon,
    RazorpayxPayrollIcon,
    AcceptPaymentsIcon,
    MagicCheckoutIcon,
    AwardIcon,
    ChevronDownIcon,
    Menu,
    MenuItem,
    MenuOverlay,
  } from '@razorpay/blade/components';

  const App = () => {
    return (
      <Box padding="spacing.4">
        <TabNav
          items={[
            { title: 'Home', href: '/home', icon: HomeIcon },
            {
              href: '/payroll',
              title: 'Payroll',
              icon: RazorpayxPayrollIcon,
              description: 'Automate payroll with ease.',
            },
            {
              href: '/payments',
              title: 'Payments',
              icon: AcceptPaymentsIcon,
              description: 'Manage payments effortlessly.',
            },
            {
              href: '/magic-checkout',
              title: 'Magic Checkout',
              icon: MagicCheckoutIcon,
              description: 'Fast, one-click checkout.',
            },
            {
              href: '/rize',
              title: 'Rize',
              icon: AwardIcon,
              isAlwaysOverflowing: true,
              description: 'Boost your business growth.',
            },
          ]}
        >
          {({ items, overflowingItems }) => {
            return (
              <>
                <TabNavItems>
                  {items.map((item) => {
                    return (
                      <TabNavItem
                        key={item.title}
                        title={item.title}
                        href={item.href}
                        icon={item.icon}
                        isActive={item.isActive}
                        trailing={item.trailing}
                      />
                    );
                  })}
                </TabNavItems>
                {overflowingItems.length ? (
                  <Menu openInteraction="hover">
                    <TabNavItem title="More" trailing={<ChevronDownIcon />} />
                    <MenuOverlay>
                      {overflowingItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <MenuItem
                            key={item.href}
                            onClick={() => {
                              console.log('clicked', item.title);
                            }}
                          >
                            <Box padding="spacing.2">
                              <Box display="flex" gap="spacing.2">
                                {Icon && <Icon />}
                                <Text weight="semibold">{item.title}</Text>
                              </Box>
                              <Text
                                marginTop="spacing.2"
                                size="small"
                                color="surface.text.gray.subtle"
                              >
                                {item.description}
                              </Text>
                            </Box>
                          </MenuItem>
                        );
                      })}
                    </MenuOverlay>
                  </Menu>
                ) : null}
              </>
            );
          }}
        </TabNav>
      </Box>
    );
  };

  export default App;
  `,
};
