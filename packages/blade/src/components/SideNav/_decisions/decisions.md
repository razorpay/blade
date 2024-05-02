# SideNav

The side navigation is positioned along the left side of the screen that provides quick access to different sections or functionalities of the application.

![alt text](nav-header.png)

## Design

- [Figma - Side Navigation](https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade-DSL?node-id=87921-138309&mode=dev)

## API

```jsx
<SideNav>
  <SideNavItem as={NavLink} title="Home" icon={HomeIcon} href="/" />
  <SideNavItem as={NavLink} title="Accounts" icon={AccountsIcon} href="/accounts/profile">
    {/* L2 */}
    {/* Alternate Name - SideNavL2 */}
    <SideNavLevel title="Accounts">
      <SideNavItem as={NavLink} title="Profile" icon={UserIcon} href="/accounts/profile" />
      <SideNavItem as={NavLink} title="Settings" icon={UserIcon} href="/accounts/settings" />
      <SideNavItem as={NavLink} title="Edit" icon={UserIcon} href="/accounts/settings">
        {/* L3 */}
        {/* Alternate Name - SideNavL3 */}
        <SideNavLevel>
          <SideNavItem as={NavLink} title="Password" icon={PassIcon} href="/accounts/edit/pass" />
          <SideNavItem as={NavLink} title="Email" icon={EmailIcon} href="/accounts/edit/email" />
        </SideNavLevel>
      </SideNavItem>
    </SideNavLevel>
  </SideNavItem>
  <SideNavSection title="Products" maxItemsDisplayed={3}>
    <SideNavItem as={NavLink} href="/payment-gateway" title="Payment Gateway" />
    <SideNavItem as={NavLink} href="/payment-pages" title="Payment Pages" />
  </SideNavSection>

  {/* Footer */}
  <SideNavFooter>
    <Box display="flex" paddingY="spacing.4" paddingX="spacing.3" justifyContent="spacing-between">
      <Box display="flex" gap="spacing.3">
        <Indicator color="positive" />
        <Text>Test Mode</Text>
      </Box>
      <Switch />
    </Box>
    <SideNavItem as={NavLink} href="/settings" title="Settings" />
  </SideNavFooter>
</SideNav>
```

## Alternate APIs

<details>
<summary>Config-driven API</summary>

### Config-driven API

**Example of Config-Driven API**

```jsx
<SideNav
  routerLink={NavLink}
  items={[
    {
      title: 'Home',
      href: '/',
      icon: HomeIcon,
    },
    {
      level: 2,
      headerTitle: 'Accounts',
      icon: AccountsIcon,
      href: '/accounts/',
      items: [
        {
          title: 'User Profile',
          icon: UserIcon,
          href: '/accounts/profile',
        },
        {
          title: 'Business Profile',
          icon: SuitcaseIcon,
          href: '/accounts/business-profile',
        },
      ],
    },
  ]}
/>
```

#### Why not config-driven API?

1. Config-Driven API requires you to have a low-level compound API anyways since compound APIs give higher flexibility into adding leading, trailing, descriptions, and other items when needed.
2. Component from Blade is better to kept independent of backend API schema since that schema can change, update, etc and shouldn't be blocked on blade.
3. Not binding it to merchant dashboard schema also allows us to use it outside of one dashboard products such admin dashboard, bank portals, products before migration to merchant dashboard

</details>

<details>
<summary>Alternate Levels API</summary>

### Alternate Levels API

Instead of nesting, we can have a trigger and L2 container separate. In trigger we can pass ref of its L2 container.

```jsx
const accountsL2Ref = React.useRef(null);

<SideNav>
  <SideNavL1>
    <SideNavItem title="Home" icon={HomeIcon} href="/" />
    <SideNavItem l2Ref={accountsL2Ref} title="Accounts" icon={UserIcon} href="/accounts" />
  </SideNavL1>

  <SideNavL2 ref={accountsL2Ref}>
    <SideNavItem title="Profile" icon={ProfileIcon} href="/accounts/profile" />
    <SideNavItem title="Business Profile" icon={BusinessIcon} href="/accounts/business">
      <SideNavL3>
        <SideNavItem title="Business Info" icon={ProfileIcon} href="/accounts/profile" />
        <SideNavItem title="Business Details" icon={ProfileIcon} href="/accounts/profile" />
      </SideNavL3>
    </SideNavItem>
  </SideNavL2>
</SideNav>;
```

#### Why not this API?

1. While its the easiest to implement considering how close it is to final DOM structure 🙈, it is complex in understanding and the backend schema we have has nested L1, L2 JSON. So its more complex to loop through a data like that and render this structure
2. When you go from L1 -> L2, SideNav slides from one nav level to other where this API makes sense. But when you go from L2 -> L3, L3 becomes a collapsed menu where nested API makes sense.

</details>

## Props

### SideNav

### SideNavItem

### SideNavLevel

### SideNavSection

### SideNavFooter

## Examples

## Accessibility

## References

- [SideNav - Primer](https://primer.style/react/deprecated/SideNav#url)

## Open Questions
