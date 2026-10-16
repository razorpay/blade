# How to use Blade in Svelte

`@razorpay/blade-svelte` is Blade for Svelte 5. It shares design tokens with React Blade through `@razorpay/blade-core`, and its component APIs follow the React ones where Svelte allows. Components use Svelte 5 runes only.

## Install

```bash
npm install @razorpay/blade-svelte
```

Requirements: Node.js 18.12.1 or later and Svelte 5.56.0 or later. `@razorpay/blade-core` (tokens, CSS and fonts) is installed as a dependency.

## Set up the app

Import the theme CSS and fonts once, in the root layout (SvelteKit `src/routes/+layout.svelte`) or the app entry (`App.svelte`), then wrap the app in `BladeProvider`.

```svelte
<script lang="ts">
  import type { Snippet } from 'svelte';
  import '@razorpay/blade-core/tokens/theme.css';
  import '@razorpay/blade-core/fonts.css';
  import { BladeProvider } from '@razorpay/blade-svelte/components';
  import { bladeTheme } from '@razorpay/blade-core/tokens';

  let { children }: { children: Snippet } = $props();
</script>

<BladeProvider themeTokens={bladeTheme} colorScheme="light">
  {@render children()}
</BladeProvider>
```

`colorScheme` accepts `light`, `dark` or `system`. A nested `BladeProvider` scopes its color scheme to its own subtree, for example a dark section on a light page. Avoid nesting it when you don't need a different scheme.

To switch the scheme at runtime, call `useTheme()` in a component rendered inside `BladeProvider`. It returns `{ theme, colorScheme, setColorScheme, platform }`.

```svelte
<script lang="ts">
  import { Button, useTheme } from '@razorpay/blade-svelte/components';

  const theme = $derived(useTheme());
</script>

<Button
  variant="tertiary"
  onClick={() => theme.setColorScheme(theme.colorScheme === 'dark' ? 'light' : 'dark')}
>
  Toggle dark mode
</Button>
```

## Imports

- Components, icons, `useTheme` and `useToast`: `@razorpay/blade-svelte/components`
- Utilities (`useInteraction`, `createPortal`): `@razorpay/blade-svelte/utils`
- Theme tokens and `createTheme`: `@razorpay/blade-core/tokens`

Never import from `@razorpay/blade`. That is the React package and its components do not run in Svelte.

## Svelte conventions used by every component

- Pass event handlers as callback props: `onClick={handleClick}`, `onChange={({ value }) => ...}`. There are no `on:click` directives or `createEventDispatcher` events.
- `children` is either a string or a snippet. `<Button>Pay</Button>` works, and so does `{#snippet}` content for components that render rich children.
- Named content slots are snippet props, for example `{#snippet trailing()}...{/snippet}` inside the component tag.
- Keep state in runes: `let value = $state('')`, `const isValid = $derived(value.length > 0)`.
- Controlled inputs take `value` plus an `onChange` callback. Don't use `bind:` on a Blade prop unless its component doc says the prop is bindable (for example `BottomSheet`'s `isOpen`).

## Overriding styles

Some components accept a `styleOverride` prop: a map from the component's named parts (slots) to your own class names, for example `{ root: 'pay-button', text: 'pay-button-text' }` for `Button`. The slot names for each component are listed in its doc. To apply the same classes to every instance, set them once on the provider with `componentConfig`. An instance `styleOverride` wins over `componentConfig`, and both win over Blade's internal styles without `!important`, because Blade's CSS sits in a lower cascade layer.

```svelte
<script lang="ts">
  import { BladeProvider, Button } from '@razorpay/blade-svelte/components';
  import { bladeTheme } from '@razorpay/blade-core/tokens';
</script>

<BladeProvider themeTokens={bladeTheme} componentConfig={{ Button: { styleOverride: { root: 'checkout-button' } } }}>
  <Button variant="primary" styleOverride={{ text: 'checkout-button-label' }}>Pay now</Button>
</BladeProvider>
```

Use overrides for brand-specific tweaks only. Reach for component props and tokens first.

## Layout

`Box` in blade-svelte is deliberately minimal. It renders an element (`as`) and forwards `className`, `testID` and HTML attributes. It has **no** style props: `display`, `gap`, `padding`, `flexDirection` or `alignItems` on `Box` do nothing. Lay it out with the utility classes that `theme.css` already ships:

- Display: `display-flex`, `display-grid`, `display-inline-flex`, `display-block`, `display-none`
- Flex: `flex-row`, `flex-col`, `flex-wrap-wrap`, `items-center`, `items-start`, `justify-between`, `justify-center`, `justify-end`
- Gap: `gap-spacing-0` to `gap-spacing-11`, plus `gap-x-spacing-N` and `gap-y-spacing-N`
- Margin: `margin-spacing-N`, `margin-top-spacing-N`, `margin-bottom-spacing-N`, `margin-left-spacing-N`, `margin-right-spacing-N`, `margin-x-spacing-N`, `margin-y-spacing-N`
- Position: `position-relative`, `position-absolute`, `position-sticky`

```svelte
<script lang="ts">
  import { Box, Button, Heading, Text } from '@razorpay/blade-svelte/components';
</script>

<Box as="section" className="display-flex flex-col gap-spacing-4">
  <Heading size="medium">Settlements</Heading>
  <Text>Your next settlement is scheduled for tomorrow.</Text>
  <Box className="display-flex justify-end gap-spacing-3">
    <Button variant="secondary">View schedule</Button>
    <Button variant="primary">Settle now</Button>
  </Box>
</Box>
```

There are no padding, width or color utility classes. For those, use a component that owns them (`Card` has `padding`, `width`, `elevation`) or your own class on an element you render yourself (a Svelte `<style>` block only styles elements in the same component, so it won't reach the element `Box` renders).

Other Blade components that accept `StyledPropsBlade` take margin and position props directly, for example `<Button marginTop="spacing.4">`. Each component doc says whether it does.

## Mapping from Figma

Blade follows "what you see in Figma is what you get in code". Select a component in Figma, open its properties, and copy the same property names and values onto the Svelte component.

```svelte
<script lang="ts">
  import { Button, CreditCardIcon } from '@razorpay/blade-svelte/components';
</script>

<Button variant="secondary" size="medium" icon={CreditCardIcon} iconPosition="left">Pay by card</Button>
```

## Using tokens in your own styles

Never hardcode colors, spacing or radii. Every Blade token is a CSS variable from `theme.css`. Replace the dots in a token path with dashes: `surface.background.gray.moderate` becomes `var(--surface-background-gray-moderate)` and `spacing.4` becomes `var(--spacing-4)`. The values follow the active color scheme automatically.

```svelte
<script lang="ts">
  import type { Snippet } from 'svelte';

  let { children }: { children: Snippet } = $props();
</script>

<div class="summary">
  {@render children()}
</div>

<style>
  .summary {
    background-color: var(--surface-background-gray-moderate);
    padding: var(--spacing-4);
    border-radius: var(--border-radius-medium);
  }
</style>
```

Prefer Blade components, their props and the layout classes above over custom CSS. Write custom styles only when none of those can express the design. See `Tokens.md` for the full token list.
