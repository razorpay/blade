# Usage

## Description

How a Svelte 5 app sets up `@razorpay/blade-svelte`, and the conventions every component follows. Read this once per task before the component docs.

## Setup

`@razorpay/blade-svelte` ships Svelte 5 source. The app's build compiles it, generates Blade's CSS with UnoCSS from Blade's config, and (optionally) turns the icons it imports into one font. Peer dependencies: `svelte` (5.56+), `unocss` (66+), `@razorpay/i18nify-js` (Amount, PhoneNumberInput), and Vite 8 for the Vite plugin.

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import UnoCSS from 'unocss/vite';
import bladePlugin from '@razorpay/blade-svelte/configs/vite';

export default defineConfig({
  plugins: [bladePlugin(), UnoCSS(), svelte()],
});
```

```ts
// uno.config.ts
import bladeUnoConfig from '@razorpay/blade-svelte/configs/uno';

export default {
  ...bladeUnoConfig({ desktop: '62.5rem' }), // the `d:` breakpoint
  // The bundled modules, Blade's `styles.ts` class maps included.
  content: { pipeline: { include: [/\.(svelte|[jt]s)($|\?)/] } },
};
```

With webpack 5 use `@razorpay/blade-svelte/configs/webpack` and `@unocss/webpack` the same way. With `@unocss/postcss`, UnoCSS scans files instead: list `./node_modules/@razorpay/blade-svelte/src/**/*.{ts,svelte}` in `content.filesystem`.

In the app entry, import the generated utilities and Blade's stylesheet, and set the page defaults Blade leaves to the app (base font, box model, form controls inheriting the font):

```ts
// main.ts
import '@razorpay/blade-svelte/blade.css'; // Blade's faces (Inter, Tasa) and opacity steps
import 'virtual:uno.css';
import './app.css'; // *, ::before, ::after { box-sizing: border-box } body { margin: 0; font-family: 'Inter', … } button, input, textarea, select { font: inherit; color: inherit }
```

Wrap the app in one `BladeProvider` whose parent is the app's shell (positioned, at most the screen, `overflow-hidden`) and whose direct child is the app's scrolling element, and render one `ToastContainer` if the app shows toasts. Overlays then cover the shell, a modal opens in view however far the content has scrolled, and nothing behind an open overlay scrolls. The classes are the app's: Blade adds no markup around its content.

```svelte
<script lang="ts">
  import { BladeProvider, Button, ToastContainer, showToast } from '@razorpay/blade-svelte/components';
</script>

<div class="relative flex h-full max-h-[100dvh] flex-col overflow-hidden"> <!-- the app's shell -->
  <BladeProvider>
    <main class="min-h-0 flex-1 overflow-auto"> <!-- scrolls -->
      <Button onClick={() => showToast({ content: 'Saved', color: 'positive' })}>Save</Button>
    </main>
    <ToastContainer />
  </BladeProvider>
</div>
```

## Entry points

| Import from | What |
| --- | --- |
| `@razorpay/blade-svelte/components` | Every component, `showToast`, `createCancel`, `back`, `getAdapters`, `useComponentDefaults`, the components' class resolvers and types |
| `@razorpay/blade-svelte/icons` | The icons (`InfoIcon`, `WalletIcon`…): sources, not components (see Icons below) |
| `@razorpay/blade-svelte/runes` | The few runes an app composes its own hosts on (`createLayerStack`, `defineContext`, `phoneDigits`…) |
| `@razorpay/blade-svelte/configs/uno`, `/configs/vite`, `/configs/webpack`, `/configs/lint` | Build and lint configuration |
| `@razorpay/blade-svelte/blade.css` | Blade's stylesheet |

There is no root import (`@razorpay/blade-svelte`), and never import from React's `@razorpay/blade`.

## Svelte 5 only

Runes and snippets: `$state`, `$derived`, `$props`, `$effect`, `{#snippet}`, `{@render}`. Never `export let`, `$:`, `on:event` directives, `<slot>` or `createEventDispatcher`.

## Conventions

**Events are callback props** (`onClick`, `onChange`) with Blade's payload object: a field reports `onChange({ name, value })`; Checkbox and Switch `onChange({ isChecked, value })`; CardGroup, ChipGroup and ActionList `onChange({ name, value })` with `value` shaped like `bind:value` (an array with `selectionType="multiple"`); Collapsible `onExpandChange({ isExpanded })`; every overlay and Tooltip `onOpenChange({ isOpen })`. Tabs and Carousel pass the bare value. No DOM event is passed, except to an item's `onClick` and to `onFocus`/`onBlur`.

**Values bind.** The current value is a bindable prop (`bind:value`, `bind:isChecked`, `bind:isOpen`, `bind:isExpanded`); there is no `defaultValue`: pass the initial value, or bind it.

```svelte
<script lang="ts">
  import { Checkbox, TextInput } from '@razorpay/blade-svelte/components';

  let email = $state('');
  let agreed = $state(false);
</script>

<TextInput bind:value={email} label="Email" type="email" />
<Checkbox bind:isChecked={agreed}>I agree to the terms</Checkbox>
```

**`children` is the trigger, `content` is what it reveals** (Tooltip, Popover, Menu, Collapsible, a CardGroupItem). Modal, BottomSheet and Drawer have no trigger: they open from a bound `isOpen`, and `children` is their content.

**Named slots are snippets.** Pass rich content as a snippet. Some slots also take an icon directly (Alert's `icon`, Button's `icon`, a header's `leading`), others a string or a snippet: check each component's props. To put an icon in a snippet slot, draw it with `Icon`:

```svelte
<script lang="ts">
  import { Badge, CardGroup, CardGroupItem, Icon } from '@razorpay/blade-svelte/components';
  import { WalletIcon } from '@razorpay/blade-svelte/icons';

  let method = $state<string | null>('wallet');
</script>

<CardGroup label="Pay with" bind:value={method}>
  <CardGroupItem value="wallet" title="Wallet">
    {#snippet leading()}<Icon source={WalletIcon} />{/snippet}
    {#snippet trailing()}<Badge color="positive">Offer</Badge>{/snippet}
  </CardGroupItem>
</CardGroup>
```

**Icons are sources, not components.** Pass an icon to a component's `icon` or `leading` prop, or draw one with `Icon`. Never write `<InfoIcon />`. Only the icons in `AvailableIcons.md` exist.

```svelte
<script lang="ts">
  import { Button, Icon } from '@razorpay/blade-svelte/components';
  import { DownloadIcon, InfoIcon } from '@razorpay/blade-svelte/icons';
</script>

<Button icon={DownloadIcon}>Download</Button>
<Icon source={InfoIcon} size="small" color="muted" />
```

**Styling is classes, and a Blade component's look is its props.** Use `variant`, `size`, `color` and the other style props for a component's look. Its `class` only places it: margin, size, its part in a flex or grid parent, position, `hidden`. Lay out and style your own elements with Blade's token classes (`p-blade-5`, `bg-surface-gray-subtle`); see `Styling.md`. There is no `Box`, no styled props (`marginTop="spacing.4"`) and no `styleOverride`.

```svelte
<script lang="ts">
  import { Button, Text } from '@razorpay/blade-svelte/components';
</script>

<div class="flex flex-col gap-blade-4 rounded-medium bg-surface-gray-intense p-blade-5 surface-raised">
  <Text weight="semibold">Order summary</Text>
  <Button class="w-full" variant="secondary">View details</Button>
</div>
```

**Labels are plain strings above their field.** `label`, `helpText`, `errorText` and `successText` name and describe a field; the hint lines also take a snippet. Validation is `validationState="error"` with `errorText`.

**Tests and analytics.** `testID` lands as `data-testid`; `data-analytics-*` props land on the component's element.

**Defaults and services come from BladeProvider.** `size` snaps every sized control; `defaults` sets any style prop per component (`{ Button: { color: 'neutral' } }`); `adapters` are the app's services (`Adapters.md`). A component's own prop always wins.

**Overlays open from state.** Modal, BottomSheet and Drawer bind `isOpen` and report `onDismiss({ source })` (`cross`, `blur`, `escape`, `back`, `drag`); Popover and Menu also open from their trigger. Call `back()` from the app's back handler first: it returns whether an open overlay handled it.

**Toasts are data.** `showToast(toast, { cancelled })` returns a promise of why the toast left (`timeout`, `dismiss`, `evicted`, `cleared`); resolving `cancelled` (from `createCancel()`) dismisses it. The app renders one `ToastContainer`.

## Lint

`@razorpay/blade-svelte/configs/lint` is an oxlint and ESLint plugin (`blade/*` rules) for the classes you write: no conflicting classes in one list (`px-2 px-4`), no classes built from pieces (`` `bg-${tone}` ``: write each class in full), no misspelled Blade tokens, spacing tokens over equal lengths (`p-[16px]` → `p-blade-5`), and no restyling of a Blade component through `class`.

```json
{
  "jsPlugins": ["@razorpay/blade-svelte/configs/lint"],
  "rules": {
    "blade/no-conflicting-classes": "error",
    "blade/no-interpolated-classes": "error",
    "blade/no-unknown-blade-class": "error",
    "blade/prefer-token": "warn",
    "blade/no-restyle": "error"
  }
}
```

## Mobile first

Components are mobile first; their desktop differences are `d:` classes (one breakpoint, 62.5rem by default), and `max-d:` is below it. Your markup uses the same variants: `class="flex-col d:flex-row"`. Nothing reads the viewport in JS.
