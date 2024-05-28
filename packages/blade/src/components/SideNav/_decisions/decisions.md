# SideNav - One Navigation Bar

The side navigation is positioned along the left side of the screen that provides quick access to different sections or functionalities of the application.

<img src="nav-header.png" height="630px" width="600px" />

## Links

- [Figma - Side Navigation](https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade-DSL?node-id=87921-138309&mode=dev)
- [Product Concept Note - Connected Navigation](https://docs.google.com/document/d/1MyCgIS8i3hfhYPiU94oNT0BwqFyNSa8fhVZLT1FlS3s/edit?usp=sharing) (Internal)
- [Stackblitz - One Nav Levels POC](https://stackblitz.com/edit/one-nav-poc?file=App.tsx)
- [Stackblitz - One Nav Router POC](https://stackblitz.com/edit/one-nav-poc-router?file=App.tsx,NavSubComponents.tsx,package.json,SideNav.tsx)

## API

<!-- prettier-ignore -->
```jsx
import { NavLink } from 'react-router-dom';

// Component
<SideNav banner={<CustomActivationCard />}>
  <SideNavBody>
    {/* L1 Items */}
    <SideNavLink as={NavLink} title="Home" icon={HomeIcon} href="/" />
    <SideNavLink
      as={NavLink}
      title="Create Payouts"
      trailing={<Button icon={PlusIcon} variant="tertiary" />}
      icon={HomeIcon}
      href="/create-payouts"
    />

    <SideNavLink 
      as={NavLink} 
      title="Accounts" 
      icon={AccountsIcon} 
      // sets the submenu as active
      isActive={true}
      href="/accounts"
    >
      {/* L2 */}
      <SideNavLevel title="Accounts">
        <SideNavLink as={NavLink} title="Profile" icon={UserIcon} href="/accounts/profile" />
        <SideNavLink 
          as={NavLink} 
          title="Settings" 
          icon={UserIcon} 
          // sets the link as active 
          isActive={true} 
          href="/accounts/settings" 
        />
        <SideNavLink as={NavLink} title="Edit" icon={UserIcon} href="/accounts/settings">
          {/* L3 */}
          <SideNavLevel>
            <SideNavLink as={NavLink} title="Password" icon={PassIcon} href="/accounts/edit/pass" />
            <SideNavLink as={NavLink} title="Email" icon={EmailIcon} href="/accounts/edit/email" />
          </SideNavLevel>
        </SideNavLink>
      </SideNavLevel>
    </SideNavLink>

    {/* Section Heading */}
    <SideNavSection title="Products" maxVisibleItems={3}>
      <SideNavLink as={NavLink} href="/payment-gateway" title="Payment Gateway" />
      <SideNavLink as={NavLink} href="/payment-pages" title="Payment Pages" />
      <SideNavLink as={NavLink} href="/payment-links" title="Payment Links" />
      <SideNavLink as={NavLink} href="/qr-codes" title="QR Codes" />
      <SideNavLink as={NavLink} href="/subscriptions" title="Subscriptions" />
    </SideNavSection>
  </SideNavBody>


  {/* Footer */}
  <SideNavFooter>
    <Box display="flex" paddingY="spacing.4" paddingX="spacing.3" justifyContent="spacing-between">
      <Box display="flex" gap="spacing.3">
        <Indicator color="positive" />
        <Text>Test Mode</Text>
      </Box>
      <Switch />
    </Box>
    <SideNavLink as={NavLink} href="/settings" title="Settings" />
  </SideNavFooter>
</SideNav>;
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
    <SideNavLink title="Home" icon={HomeIcon} href="/" />
    <SideNavLink l2Ref={accountsL2Ref} title="Accounts" icon={UserIcon} href="/accounts" />
  </SideNavL1>

  <SideNavL2 ref={accountsL2Ref}>
    <SideNavLink title="Profile" icon={ProfileIcon} href="/accounts/profile" />
    <SideNavLink title="Business Profile" icon={BusinessIcon} href="/accounts/business">
      <SideNavL3>
        <SideNavLink title="Business Info" icon={ProfileIcon} href="/accounts/profile" />
        <SideNavLink title="Business Details" icon={ProfileIcon} href="/accounts/profile" />
      </SideNavL3>
    </SideNavLink>
  </SideNavL2>
</SideNav>;
```

#### Why not this API?

1. While its the easiest to implement considering how close it is to final DOM structure 🙈, it is complex in understanding and the backend schema we have has nested L1, L2 JSON. So its more complex to loop through a data like that and render this structure
2. When you go from L1 -> L2, SideNav slides from one nav level to other where this API makes sense. But when you go from L2 -> L3, L3 becomes a collapsed menu where nested API makes sense.

</details>

## Props

### SideNav

| **Props** | **Description**                                                                                                                                                                         | **Type** | **Default Value** |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ----------------- |
| children  | children slot of SideNav, accepts SideNavBody, SideNavFooter                                                                                                                            | JSX      |                   |
| banner    | Slot at the top of SideNav for rendering critical UI info like Activation Pending Card. Meant for critical information only, if you see it being used for promotional banners, dial 100 | JSX      |                   |

```jsx
<SideNav>{/* children */}</SideNav>
```

#### Banner Example

<table>
<tr>
<td>

<!-- prettier-ignore -->
```jsx
<SideNav 
  banner={
    <Card href="/activate">
      {/* Activation Pending Styles */}
    </Card>
  }
>
  {/* children */}
</SideNav>
```

</td>

<td>
<img width="300px" src="nav-banner.png" />
</td>
</tr>
</table>

### SideNavBody

| **Props** | **Description**                                                                 | **Type** | **Default Value** |
| --------- | ------------------------------------------------------------------------------- | -------- | ----------------- |
| children  | children slot of SideNavBody, accepts SideNavLink, SideNavSection, SideNavLevel | JSX      |                   |

```jsx
<SideNav>
  <SideNavBody>{/* children */}</SideNavBody>
  <SideNavFooter>{/* children */}</SideNavFooter>
</SideNav>
```

### SideNavLink

| **Props**   | **Description**                                                                                                              | **Type**                      | **Default Value**                                            |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------- | ----------------------------- | ------------------------------------------------------------ |
| title       | title of SideNavLink                                                                                                         | string                        |                                                              |
| as          | as prop for passing React Router's NavLink                                                                                   | NavLinkComponentType          |                                                              |
| href        | URL to navigate to. Internally links to `to` attribute of router                                                             | string                        |                                                              |
| isActive    | Sets the link as selected / active                                                                                           | boolean                       | undefined                                                    |
| target      | anchor tag target attribute [target - MDN Documentation](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#target) | AnchorTargetType              | \_self                                                       |
| rel         | anchor tag rel attribute [rel - MDN Documentation](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#rel)          | AnchorRelType                 | target === ' \_blank ' ? ' noreferrer noopener ' : undefined |
| onClick     | Click handler on item                                                                                                        | (e: React.MouseEvent) => void |                                                              |
| icon        | Blade's Icon Component                                                                                                       | IconComponent                 |                                                              |
| trailing    | Trailing Slot of Item. It is visible on hover only. Can be used for adding Quick Shortcut Button, Trailing Text              | JSX                           |                                                              |
| titleSuffix | Slot after the title to add Badge, Counter                                                                                   | JSX                           |                                                              |
| tooltip     | Object with props that are forwarded to tooltip                                                                              | TooltipProps                  | undefined                                                    |
| children    | SideNavLink children slot. Items inside children turn into next level item with parent as a trigger                          | JSX                           | undefined                                                    |

#### Example Nav Links

<table>

<tr><td>Code</td><td>Preview</td></tr>

<tr>
<td>

<!-- prettier-ignore -->
```jsx
<SideNavLink
  as={NavLink}
  icon={BillIcon}
  title="Vendor Payments"
  href="/vendor-payments"
/>
```

</td>
<td><img src="navlink-eg-1.png" width="200px" /></td>
</tr>

<tr>
<td>

<!-- prettier-ignore -->
```jsx
<SideNavLink
  as={NavLink}
  icon={LayoutIcon}
  title="L1 Item Name"
  href="/l1-item"
  // This will be controlled on consumer
  // depending on react-router active state
  isActive={true}
/>
```

</td>
<td><img src="navlink-eg-active.png" width="200px" /></td>
</tr>
<tr>
<td>

<!-- prettier-ignore -->
```jsx
<SideNavLink
  as={NavLink}
  icon={PayoutIcon}
  title="Create Payouts"
  href="/payouts"
  trailing={
    <Button
      href="/payouts/create"
      icon={PlusIcon}
      size="xsmall"
      variant="tertiary"
    />
  }
/>
```

</td>
<td><img src="navlink-eg-2.png" width="200px" /></td>
</tr>

<tr>
<td>

<!-- prettier-ignore -->
```jsx
<SideNavLink
  as={NavLink}
  icon={LayoutIcon}
  title="L1 Item Name"
  href="/new-item-link"
  titleSuffix={
    <Badge color="positive">New</Badge>
  }
/>
```

</td>
<td><img src="navlink-eg-3.png" width="200px" /></td>
</tr>

<tr>

<td>

<!-- prettier-ignore -->
```jsx
<SideNavLink
  as={NavLink}
  icon={LayoutIcon}
  title="L1 Item Name"
  href="/new-item-link"
  tooltip={{
    content: "Action Name (Cmd + P)"
  }}
/>
```

</td>
<td><img src="navlink-eg-4.png" width="240px" /></td>
</tr>

<tr>

<td>

<!-- prettier-ignore -->
```jsx
<SideNavLink
  as={NavLink}
  icon={ArrowUpRightIcon}
  title="Create Payout"
  href="/payouts"
  trailing={
    <Tooltip content="Action Name (Cmd + P)">
      <Button
        href="/payouts/create"
        icon={PlusIcon}
        size="xsmall"
        variant="tertiary"
      />
    </Tooltip>
  }
/>
```

</td>
<td><img src="navlink-eg-tooltip.png" width="300px" /></td>
</tr>

</table>

### SideNavLevel

Nested SideNavLevel components create new levels. This can be used to create L1 - L2 - L3 levels in your navbar

| **Props** | **Description**                                | **Type** | **Default Value** |
| --------- | ---------------------------------------------- | -------- | ----------------- |
| children  | children slot. Accepts SideNavLink as children | JSX      |                   |

<table>
<tr>
<td>

```jsx
<SideNav>
  {/* L1 Items */}
  <SideNavLink title="L1 Item" />


  {/* isActive marks this submenu as active */}
  <SideNavLink title="L2 Trigger" isActive>
    {/* L2 Level */}
    <SideNavLevel>
      <SideNavLink />
      {/* isActive marks this link as active */}
      <SideNavLink isActive />
      <SideNavLink title="L3 Trigger">
        {/* L3 Level */}
        <SideNavLevel>
          <SideNavLink />
          <SideNavLink />
        </SideNavLevel>
      </SideNavLink>
    </SideNavLevel>
</SideNav>
```

</td>

<td>
<img width="500px" src="navlevels-eg.png" />
</td>
</tr>
</table>

### SideNavSection

| **Props**            | **Description**                                              | **Type**                      | **Default Value** |
| -------------------- | ------------------------------------------------------------ | ----------------------------- | ----------------- |
| title                | title of the section                                         | string                        |                   |
| maxVisibleItems      | Number of items visible (rest go inside +x more collapsible) | number                        | undefined         |
| onToggleVisibleItems | Callback when collapsed items are expanded or collapsed back | (isExpanded: boolean) => void | undefined         |
| children             | Children slot. For SideNavLink children items                | JSX                           |                   |

<table>
<tr>
<td>

<!-- prettier-ignore -->
```jsx
<SideNav>
  <SideNavSection 
    title="OFFERINGS SECTION" 
    maxVisibleItems={3}
    onToggleVisibleItems={(isExpanded) => {
      console.log("When +13 More is clicked")
    }}
  >
    {/* All SideNavLink items */}
  </SideNavSection>
</SideNav>
```

</td>

<td>
<img width="200px" src="navsection-eg.png" />
</td>
</tr>
</table>

### SideNavItem

A generic non-link item that gives you leading, trailing slots to render the components as per your usecase.

> [!Note]
>
> SideNavItem cannot be active, cannot be link, and cannot be button. It can be static item with something interaction in trailing slot

| **Props** | **Description**                                                                      | **Type**     | **Default Value** |
| --------- | ------------------------------------------------------------------------------------ | ------------ | ----------------- |
| title     | title of SideNavItem                                                                 | string       |                   |
| as        | as prop for passing render element. Use `label` if trailing has some input component | div          |                   |
| leading   | leading slot. Render indicator / icon here                                           |              |                   |
| trailing  | Trailing Slot of Item. Render Switch, or any other blade component here              | JSX          |                   |
| tooltip   | Object with props that are forwarded to tooltip                                      | TooltipProps | undefined         |

For Example of SideNavItem, check SideNavFooter example below.

### SideNavFooter

| **Props** | **Description** | **Type** | **Default Value** |
| --------- | --------------- | -------- | ----------------- |
| children  | Children slot   | JSX      |                   |

<table>
<tr>
<td>

<!-- prettier-ignore -->
```jsx
<SideNav>
  {/* ... Other Items */}
  <SideNavFooter>
    <SideNavItem
      as="label"
      title="Test Mode"
      leading={
        <Indicator
          color={
            isTestModeActive 
            ? 'notice' 
            : 'positive'
          }
          emphasis="intense"
          accessibilityLabel=""
        />
      }
      backgroundColor={
        isTestModeActive 
        ? `feedback.background.notice.subtle` 
        : undefined
      }
      trailing={
        <Switch
          accessibilityLabel=""
          size="small"
          isChecked={isTestModeActive}
          onChange={({ isChecked }) => {
            setIsTestModeActive(isChecked);
          }}
        />
      }
    />
    <SideNavLink 
      as={NavLink}
      icon={GearIcon}
      href="/settings" 
      title="Settings" 
    >
      {/* L2 SideNavLink items */}
    </SideNavLink>
  </SideNavFooter>
</SideNav>
```

</td>

<td>
<img width="300px" src="navfooter-eg.png" />
</td>
</tr>
</table>

## Accessibility

1. All items should be accessible by `TAB`. Including going between levels L1, L2, L3
2. We should use Blade's `SkipNav` utility to provide option of skipping nav and going to content
3. React Router automatically handles `aria-current="page"`. Verify that it is working as expected.

## References

- [RazorpayX Navigation Bar](https://github.com/razorpay/x/blob/master/src/js/views/Home/ActionCenter/index.js#L21) (Internal)
- [Razorpay Merchant Dashboard Navigation Bar](https://github.com/razorpay/dashboard/blob/6f61a5909c5311c3be08a3ea28b920ed302f1e64/web/js/merchant/components/SidebarV2/Sidebar.tsx) (Internal)
- [SideNavigation - Atlassian DS](https://atlassian.design/components/side-navigation/examples)
- [SideNav - Primer / GitHub](https://primer.style/react/deprecated/SideNav#url)
- [SideNav - Carbon DS](https://react.carbondesignsystem.com/?path=/story/components-ui-shell-sidenav--fixed-side-nav)
- [SideNav - BaseWeb DS / Uber](https://baseweb.design/components/side-nav/#colors)
- [sidenav - Spectrum / Adobe](https://opensource.adobe.com/spectrum-web-components/components/sidenav/)

## Open Questions

### Dev

- #### Parent Component Name: `SideNav` vs `Sidebar` vs `Navbar` vs `Nav`

  SideNav

- #### Navigation Item Naming Decision: `SideNavLink` vs `SideNavItem` vs `SideNavItemLink`

  SideNavLink

- #### `<SideNav routerLink={NavLink} />` vs `<SideNavLink as={NavLink} />`

  1. We pass react router on parent SideNav component

  - Example
    ```jsx
    <SideNav routerLink={NavLink}>
      <SideNavLink />
      <SideNavLink />
    </SideNav>
    ```
  - Pros: Router Link defined at one place on top so less likely to be missed / changed between multiple items
  - Cons: Uncommon pattern

  2. We pass it from as prop on SideNavLink component

  - Example
    ```jsx
    <SideNav>
      <SideNavLink as={NavLink} />
      <SideNavLink as={NavLink} />
    </SideNav>
    ```
  - Pros: Common pattern
  - Cons: Requires defining NavLink at each item (for projects not part of One Dashboard like Admin Dashboard, Bank Portals, etc)

  ##### Conclusion

  We are going with `as={NavLink}`

- #### Why `isActive` prop? Why not handle active state internally

  Earlier we started the API by saying that marking of the link as active based on route will be handled internally in blade component. There are some implemetation constraints when we go with this approach of handling active link internally

  1. We don't have access to hooks like `useLocation` or utilities like `matchPath` inside Blade since blade is library indepedent of the routing logic
  2. Although React Router's NavLink automatically adds `aria-current="page"` to active link which can be used to change colors in CSS, it doesn't give us access to handling state internally for our L1 -> L2 navigations [Here's the related proposal I created in React Router's Repo](https://github.com/remix-run/react-router/discussions/11543).
  3. Overall there's no stable way to manage the `isActive` state internally in React x React Router setup currently.

### Design

- Should L2 trigger also change the route?
  - Conclusion: Yes

### Product

- [Product Questions Discussion - Slack Thread](https://razorpay.slack.com/archives/C06F9MYVBR7/p1714635586127469?thread_ts=1713943186.663279&cid=C06F9MYVBR7)
- #### Should URLs follow the nesting defined by navigation?

  - ##### Problem

    Problem and Ideal state is documented in [Doc - URL Patterns Based on Navigation](https://docs.google.com/document/d/1pOwpHVaGQak7AyCzvVWOFTRVnYnWlDSd-dKEtD3yc5Y/edit?usp=sharing) (Internal)

  - Conclusion:
    - While we discussed this internally (in engineering), it becomes out of scope for Blade since [we can't handle active state internally anyways](#why-isactive-prop-why-not-handle-active-state-internally)
    - Although its a problem that we'll have to solve on product level hence documented this as we had good insights on what are pros of having nested routing
