## Component Name

Breadcrumb

## Description

Breadcrumb shows where the current page sits in the app's hierarchy and links back to its parent pages, for example Home / Payments / Settlements. Compose it with `BreadcrumbItem` links, marking the last one with `isCurrentPage`. Separators are added automatically. The `stepper` variant renders the items as pills separated by chevrons, for multi-step flows such as checkout.

## Important Constraints

- `BreadcrumbItem` must be rendered inside `Breadcrumb`; it reads size, color and variant from the Breadcrumb context and fails without it
- `href` is required on every `BreadcrumbItem`, but an item with `isCurrentPage` renders as plain text and ignores `href` and `onClick`
- Separators are inserted by `Breadcrumb`; the separator after the last item is hidden unless `showLastSeparator` is set
- `icon` only accepts an icon component exported by `@razorpay/blade-svelte/components`
- Partial port of React: `BreadcrumbItem` has no `as` prop for router link components; use `onClick` with `event.preventDefault()` for client-side routing

## TypeScript Types

These are the props the Breadcrumb component and BreadcrumbItem accept.

```typescript
type BreadcrumbSize = 'small' | 'medium' | 'large';
type BreadcrumbColor = 'neutral' | 'primary' | 'white';
type BreadcrumbVariant = 'default' | 'stepper';

type IconSize = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | '2xlarge';

/**
 * Any icon exported by @razorpay/blade-svelte/components, e.g. HomeIcon.
 * Color values are the icon color tokens listed in Icons.md.
 */
type IconComponent = Component<{ size?: IconSize; color?: string }>;

interface BreadcrumbProps extends StyledPropsBlade {
  /**
   * Content of the Breadcrumb, accepts BreadcrumbItem components.
   */
  children: Snippet;

  /**
   * Size of the Breadcrumb.
   * @default 'medium'
   */
  size?: BreadcrumbSize;

  /**
   * Color of the Breadcrumb.
   * @default 'primary'
   */
  color?: BreadcrumbColor;

  /**
   * Visual variant of the Breadcrumb.
   * - `default`: text links separated by a `/`.
   * - `stepper`: progress steps where the current page is a filled pill and
   *   items are separated by a chevron icon.
   * @default 'default'
   */
  variant?: BreadcrumbVariant;

  /**
   * Whether to show the last separator.
   * @default false
   */
  showLastSeparator?: boolean;

  /**
   * Accessibility label for the breadcrumb navigation.
   * @default 'Breadcrumb'
   */
  accessibilityLabel?: string;

  /** Test ID for the element. */
  testID?: string;

  /** Analytics data attributes. */
  [key: `data-analytics-${string}`]: string;
}

interface BreadcrumbItemProps {
  /**
   * Href of the BreadcrumbItem.
   */
  href: string;

  /**
   * Function to be called on click of the BreadcrumbItem.
   * Can be used to integrate with routing libraries.
   */
  onClick?: (event: MouseEvent) => void;

  /**
   * Whether the BreadcrumbItem is the current page.
   * Sets the aria-current attribute to `page`.
   * @default false
   */
  isCurrentPage?: boolean;

  /**
   * Content of the BreadcrumbItem.
   */
  children?: Snippet | string;

  /**
   * Icon to be shown before the BreadcrumbItem.
   */
  icon?: IconComponent;

  /**
   * Accessibility label for the BreadcrumbItem, can be used in icon-only variants.
   */
  accessibilityLabel?: string;

  /** Analytics data attributes. */
  [key: `data-analytics-${string}`]: string;
}
```

## Usage Guidelines

**Do**

- Use `Breadcrumb` on pages that are two or more levels deep, such as a single settlement inside Settlements.
- Mark the last item with `isCurrentPage` so it gets `aria-current="page"` and is not a link.
- Pass `accessibilityLabel` on icon-only items, such as a Home item with only `HomeIcon`.
- Use `color="white"` on dark or colored surfaces, and `primary` or `neutral` on light surfaces.
- Use `onClick` with `event.preventDefault()` to hand navigation to your router, and keep `href` for open-in-new-tab.
- Use `variant="stepper"` to show progress through a short, ordered flow such as Contact, Address, Payment.
- Keep item labels short, using the page titles users see in navigation.

**Don't**

- Don't type separators such as `/` or `>` yourself; Breadcrumb adds them.
- Don't use Breadcrumb as the main navigation; use it alongside a navigation component.
- Don't use Breadcrumb to switch between views of the same page; use `Tabs`.
- Don't build very deep trails; collapse intermediate levels or link to the nearest meaningful parent.

## Examples

### Settlement details trail

A default breadcrumb with an icon-only Home item, client-side routing and analytics attributes.

```svelte
<script lang="ts">
  import { Breadcrumb, BreadcrumbItem, HomeIcon } from '@razorpay/blade-svelte/components';

  let currentPath = $state('/settlements/setl_NkP8x2Zc1');

  function navigateTo(path: string) {
    return (event: MouseEvent) => {
      event.preventDefault();
      currentPath = path;
    };
  }
</script>

<Breadcrumb size="medium" color="primary" data-analytics-section="settlement-breadcrumb">
  {#snippet children()}
    <BreadcrumbItem
      icon={HomeIcon}
      href="/home"
      accessibilityLabel="Home"
      onClick={navigateTo('/home')}
    />
    <BreadcrumbItem href="/settlements" onClick={navigateTo('/settlements')}>
      Settlements
    </BreadcrumbItem>
    <BreadcrumbItem isCurrentPage href={currentPath}>setl_NkP8x2Zc1</BreadcrumbItem>
  {/snippet}
</Breadcrumb>
```

### Checkout stepper

The `stepper` variant tracks progress through checkout; the current step is a filled pill.

```svelte
<script lang="ts">
  import { Breadcrumb, BreadcrumbItem } from '@razorpay/blade-svelte/components';

  const steps = [
    { path: '/checkout/contact', label: 'Contact' },
    { path: '/checkout/address', label: 'Address' },
    { path: '/checkout/payment', label: 'Payment' },
  ];

  let currentStep = $state('/checkout/contact');

  function goToStep(path: string) {
    return (event: MouseEvent) => {
      event.preventDefault();
      currentStep = path;
    };
  }
</script>

<Breadcrumb variant="stepper" color="neutral" size="small" accessibilityLabel="Checkout steps">
  {#snippet children()}
    {#each steps as step (step.path)}
      <BreadcrumbItem
        href={step.path}
        isCurrentPage={currentStep === step.path}
        onClick={goToStep(step.path)}
      >
        {step.label}
      </BreadcrumbItem>
    {/each}
  {/snippet}
</Breadcrumb>
```
