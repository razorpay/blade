## Component Name

BladeProvider

## Description

BladeProvider wraps the app once and gives every Blade component under it an overall control `size`, per-component style `defaults` and the app's services as `adapters` (see Adapters.md). After its content it renders the overlay host in the nearest positioned ancestor: the one scrim under every open modal, the box Modal, BottomSheet, Drawer, Popover, Menu, Tooltip and toasts render into, and the polite live region screen-reader announcements use. It sets defaults, not a theme: theming is CSS variables (Theming.md).

## Important Constraints

- Put it inside the element overlays must stay within, and make that element positioned (`relative`): the overlay host fills it
- The outermost provider hosts every overlay on the page; a nested provider renders no host and only layers its own `size`, `defaults` and `adapters` over the enclosing ones
- `size` snaps every sized control (Button, IconButton, Link, the inputs, Checkbox, RadioGroup, ChipGroup, Switch, SegmentedControl, Tabs) to its nearest size; display components and the overlays keep their own
- `defaults` takes style props only (`variant`, `color`, `size`, `placement`…), keyed by component name; behaviour props cannot be defaulted. A component's own prop wins, then the nearest provider's entry for it, then its `size`, then Blade's default
- `adapters` merge over the enclosing provider's and stay live (a swapped adapter reaches mounted components); `null` unsets one for the subtree
- There is no `themeTokens`, `colorScheme` or dark mode
- `back()` returns whether an open overlay handled a back press: call it from the app's back handler before its own navigation
- `getAdapters()` and `useComponentDefaults(name, () => props)` are for the app's own components and must be called during component init

## Props

```typescript
type DefaultSize = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';

interface BladeProviderProps {
  /** The size every sized control takes, snapped to the nearest size each one has. */
  size?: DefaultSize;
  /** Per component, default style props: `{ Button: { color: 'neutral' }, ToastContainer: { placement: 'top' } }`. Nearer providers win. */
  defaults?: ComponentDefaults;
  /** The app's services (`BladeAdapters`), merged over the enclosing ones; `null` unsets one for this subtree. */
  adapters?: BladeAdaptersOverride;
  /** Lands on the overlay host; its scrim, surfaces box and live region get `-backdrop`, `-surfaces`, `-live`. */
  testID?: string;
  /** The app. */
  children: Snippet;
}
```

## Guidelines

- Render one BladeProvider at the root of the app, inside a `relative` container, with the app's one `ToastContainer` inside it.
- Use `defaults` for an app-wide look (`{ Button: { color: 'neutral' } }`); set a one-off look on the component's own props.
- Nest a provider only to change defaults or adapters for a subtree (a dense settings panel at `size="small"`, a form's `adapters.form`).
- Wire `navigate`, `track` and `reportError` adapters early; every link, analytics event and caught error goes through them.
- In the app's back handler, call `back()` first and navigate only when it returns `false`.
- Read the app's adapters in your own components with `getAdapters()`, and let them take provider defaults with `useComponentDefaults('Name', () => ({ … }))` (its `.current` holds the filled-in props; add the name to `ComponentStyleProps` by declaration merging).
- Don't put the provider outside the frame overlays should stay in (a checkout card): modals would cover the whole page.

## Examples

### The app root

```svelte
<script lang="ts">
  import { BladeProvider, ToastContainer } from '@razorpay/blade-svelte/components';
  import type { Snippet } from 'svelte';

  let { children }: { children: Snippet } = $props();
</script>

<div class="relative min-h-screen">
  <BladeProvider size="medium" defaults={{ Button: { color: 'neutral' }, ToastContainer: { placement: 'top' } }}>
    {@render children()}
    <ToastContainer />
  </BladeProvider>
</div>
```

### Adapters and a back handler

```svelte
<script lang="ts">
  import { BladeProvider, ToastContainer, back, createToasts } from '@razorpay/blade-svelte/components';
  import type { Snippet } from 'svelte';

  // `onBackPress` registers a handler with the app's back source (a native bridge, the router's guard).
  let { children, onBackPress }: { children: Snippet; onBackPress: (handler: () => void) => void } = $props();

  const toasts = createToasts();
  const adapters = {
    toasts,
    track: (event: string, payload?: Record<string, unknown>) => console.debug(event, payload),
    navigate: (href: string) => {
      history.pushState({}, '', href);
      return true;
    },
    reportError: (error: unknown) => console.error(error),
  };

  // Back: an open overlay closes first; otherwise the app navigates.
  $effect(() => {
    onBackPress(() => {
      if (!back()) history.back();
    });
  });
</script>

<div class="relative h-full">
  <BladeProvider {adapters}>
    {@render children()}
    <ToastContainer />
  </BladeProvider>
</div>
```

### A nested provider for a dense subtree

```svelte
<script lang="ts">
  import { BladeProvider, Button, Checkbox, TextInput } from '@razorpay/blade-svelte/components';
</script>

<!-- Inherits the app provider's adapters and host; only the size changes here. -->
<BladeProvider size="small">
  <div class="flex flex-col gap-blade-4 p-blade-5">
    <TextInput label="Business name" />
    <Checkbox>Send me settlement emails</Checkbox>
    <Button class="self-start">Save</Button>
  </div>
</BladeProvider>
```
