## Component Name

Breadcrumb

## Description

Breadcrumb shows where the user is as a trail of links, from the top of the app to the current page. It renders a `<nav>` (named "Breadcrumb" by default) around an ordered list of `BreadcrumbItem`s, in three sizes and three colours. The `subtle` emphasis (default) is links between slashes; `intense` is Blade DSL's trail of pills between chevrons, with the current page in a tinted pill. The current page is plain text marked `aria-current="page"`.

## Important Constraints

- `Breadcrumb`'s children are `BreadcrumbItem`s; each item's label is its `children`
- Mark the last item `isCurrentPage`: it renders as text, not a link, and its `href` is not used
- An icon-only item (`icon` and no `children`) needs `accessibilityLabel`
- `icon` takes an icon source from `@razorpay/blade-svelte/icons`
- `href` routes through `adapters.navigate`; `onClick` runs first, and `event.preventDefault()` keeps the user in place
- `size` applies to `subtle` only: `intense` has one size
- Breadcrumb's `class` places the trail; BreadcrumbItem takes no `class`

## Props

```typescript
type BreadcrumbSize = 'small' | 'medium' | 'large';
type BreadcrumbColor = 'primary' | 'neutral' | 'white';
type BreadcrumbEmphasis = 'subtle' | 'intense';

interface BreadcrumbProps {
  /** The BreadcrumbItems. */
  children: Snippet;
  /** Subtle only: 12, 14 or 16px links. @default 'medium' */
  size?: BreadcrumbSize;
  /** `white` over a dark or brand-coloured surface. @default 'primary' */
  color?: BreadcrumbColor;
  /** `subtle`: links between slashes. `intense`: pills between chevrons. @default 'subtle' */
  emphasis?: BreadcrumbEmphasis;
  /** A separator after the last item too. @default false */
  showLastSeparator?: boolean;
  /** Names the nav. @default 'Breadcrumb' */
  accessibilityLabel?: string;
  testID?: string;
  /** Placement only. */
  class?: string;
}

interface BreadcrumbItemProps {
  /** Where it goes, routed through `adapters.navigate`. Required: every item is a link. */
  href: string;
  /** Called on click, before navigation; `event.preventDefault()` cancels it. */
  onClick?: (event: MouseEvent) => void;
  /** The page the user is on: plain text (or the selected pill), `aria-current="page"`. @default false */
  isCurrentPage?: boolean;
  /** The label; omit for an icon-only item. */
  children?: Snippet;
  /** Before the label. */
  icon?: IconSource;
  /** Names an icon-only item. */
  accessibilityLabel?: string;
  testID?: string;
}
```

## Guidelines

- Use a breadcrumb on pages two or more levels deep, with the current page last.
- Start the trail with a home item, often icon-only (`icon={HomeIcon}` with `accessibilityLabel="Home"`).
- Use `color="white"` on dark or brand-coloured surfaces and `neutral` where primary links would compete with the page.
- Use `emphasis="intense"` for a step-like trail (Contact, Address, Payment) where the current step should stand out.
- Don't use a breadcrumb as the main navigation or for a single level.
- Don't put Links inside a BreadcrumbItem: the item is already a link.

## Examples

### A trail

```svelte
<script lang="ts">
  import { Breadcrumb, BreadcrumbItem } from '@razorpay/blade-svelte/components';
  import { HomeIcon } from '@razorpay/blade-svelte/icons';
</script>

<Breadcrumb>
  <BreadcrumbItem href="/" icon={HomeIcon} accessibilityLabel="Home" />
  <BreadcrumbItem href="/payments">Payments</BreadcrumbItem>
  <BreadcrumbItem href="/payments/settlements">Settlements</BreadcrumbItem>
  <BreadcrumbItem isCurrentPage>Settlement 4521</BreadcrumbItem>
</Breadcrumb>
```

### Neutral, small, on a brand surface

```svelte
<script lang="ts">
  import { Breadcrumb, BreadcrumbItem } from '@razorpay/blade-svelte/components';
</script>

<div class="flex flex-col gap-blade-5">
  <Breadcrumb size="small" color="neutral">
    <BreadcrumbItem href="/settings">Settings</BreadcrumbItem>
    <BreadcrumbItem isCurrentPage>Webhooks</BreadcrumbItem>
  </Breadcrumb>
  <div class="rounded-medium bg-interactive-primary-default p-blade-4">
    <Breadcrumb color="white">
      <BreadcrumbItem href="/reports">Reports</BreadcrumbItem>
      <BreadcrumbItem isCurrentPage>Monthly</BreadcrumbItem>
    </Breadcrumb>
  </div>
</div>
```

### Intense steps with a click handler

```svelte
<script lang="ts">
  import { Breadcrumb, BreadcrumbItem } from '@razorpay/blade-svelte/components';

  const steps = ['Contact', 'Address', 'Payment'];
  let current = $state('Address');

  function go(step: string, event: MouseEvent): void {
    event.preventDefault();
    current = step;
  }
</script>

<Breadcrumb emphasis="intense" accessibilityLabel="Checkout steps">
  {#each steps as step (step)}
    <BreadcrumbItem href="#{step.toLowerCase()}" isCurrentPage={current === step} onClick={(event) => go(step, event)}>
      {step}
    </BreadcrumbItem>
  {/each}
</Breadcrumb>
```
