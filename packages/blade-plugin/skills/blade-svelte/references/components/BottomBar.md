## Component Name

BottomBar

## Description

BottomBar is the surface along the bottom edge of a screen that holds bottom navigation or the screen's main actions. It draws Blade DSL's bar (the intense gray surface, a muted top border and an upward shadow, 4px in above and at the sides, and the device's safe area below) and is a `role="group"` named by `accessibilityLabel`. Unlike Blade React's, it does not position itself: fix it where the app needs it through `class`.

## Important Constraints

- It does not position itself: pass `fixed inset-x-0 bottom-0`, `sticky bottom-0` or `absolute inset-x-0 bottom-0` in `class`, or leave it in the flow
- It is already full width (`w-full`); don't add a width class
- Its bottom padding is the device's safe area (`env(safe-area-inset-bottom)`), at least 4px; the safe area is non-zero only when the page's viewport meta declares `viewport-fit=cover`
- `children` is the content, laid out by you (a row of nav items, a full-width Button); the bar adds no row layout of its own
- Leave room for the bar in the page (`pb-*` on your scroll container) when it is fixed over content

## Props

```typescript
interface BottomBarProps {
  /** The bar's content: navigation items, actions. */
  children: Snippet;
  /** Names the bar (`role="group"`). */
  accessibilityLabel?: string;
  testID?: string;
  /** Positioning (`fixed`, `sticky`, `absolute`, inset, `z-*`) and margins. */
  class?: string;
}
```

## Guidelines

- Use a BottomBar for primary navigation or the screen's main action (Pay, Continue).
- Give it an `accessibilityLabel` that says what it holds ("Main navigation", "Payment actions").
- Raise it over content with a `z-*` class when it is `fixed` or `absolute`.
- Don't restyle its surface (background, border, shadow, padding) through `class`.
- Hide it on desktop with `d:hidden` when the desktop layout has its own navigation.

## Examples

### Bottom navigation

```svelte
<script lang="ts">
  import { BottomBar, Icon, Text } from '@razorpay/blade-svelte/components';
  import { HomeIcon, ReportsIcon, SettingsIcon, WalletIcon } from '@razorpay/blade-svelte/icons';

  const items = [
    { label: 'Home', href: '/', icon: HomeIcon },
    { label: 'Payments', href: '/payments', icon: WalletIcon },
    { label: 'Reports', href: '/reports', icon: ReportsIcon },
    { label: 'Settings', href: '/settings', icon: SettingsIcon },
  ];
</script>

<BottomBar class="fixed inset-x-0 bottom-0 z-10 d:hidden" accessibilityLabel="Main navigation">
  <nav class="flex h-16 w-full flex-row items-center" aria-label="Main">
    {#each items as item (item.label)}
      <a href={item.href} class="flex flex-1 flex-col items-center gap-blade-1 text-surface-gray-muted no-underline">
        <Icon source={item.icon} size="large" />
        <Text size="xsmall" color="inherit">{item.label}</Text>
      </a>
    {/each}
  </nav>
</BottomBar>
```

### A screen's main action

```svelte
<script lang="ts">
  import { BottomBar, Button } from '@razorpay/blade-svelte/components';
</script>

<div class="relative flex min-h-screen flex-col">
  <main class="flex-1 p-blade-5">…</main>
  <BottomBar class="sticky bottom-0" accessibilityLabel="Payment actions">
    <div class="p-blade-3">
      <Button size="large" class="w-full">Pay ₹1,299</Button>
    </div>
  </BottomBar>
</div>
```
