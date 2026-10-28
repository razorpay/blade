<script lang="ts">
  import type { Snippet } from 'svelte';
  import { provideAdapters, type BladeAdaptersOverride } from '../../adapters';
  import { provideLiveRegion } from '../../runes/announce/live-region.svelte';
  import { provideDefaults } from '../../runes/defaults/defaults.svelte';
  import { claimOverlayHost } from '../../runes/layer/host.svelte';
  import OverlayHost from './OverlayHost.svelte';
  import type { ComponentDefaults, DefaultSize } from '../defaults';

  interface Props {
    /**
     * The size every sized control takes (Button, the inputs, Checkbox,
     * RadioGroup, Tabs…), snapped to the nearest size each one has. A
     * component's own entry in `defaults` and its own prop win over it.
     */
    size?: DefaultSize;
    /**
     * Per component: default style props — `{ Button: { color: 'neutral' },
     * ToastContainer: { placement: 'top' } }`. Nearer providers win; a component's
     * prop wins over all. Desktop differences are the components' own `d:`
     * classes, not values here.
     */
    defaults?: ComponentDefaults;
    /**
     * App services, merged over the enclosing ones and kept live: analytics,
     * router, errors, haptics, the screen-reader announcer, the locale, the
     * form, the dropdown takeover (`presentDropdown`) and OTP reading
     * (`readOTP`) (`BladeAdapters`). Toasts are not an adapter: `showToast`
     * adds to the page's one queue.
     * `null` unsets the enclosing one for this subtree.
     */
    adapters?: BladeAdaptersOverride;
    /**
     * While a modal, sheet or drawer is open, everything beside the overlay
     * host goes inert: focus, clicks and the screen reader stay in the
     * overlay. `false` keeps the page live behind the scrim, for an app that
     * stages its own content beside a sheet (a card art, a countdown) that
     * the screen reader must still reach. Focus still stays in the overlay.
     * Only the outermost provider's value counts.
     * @default true
     */
    isolatePage?: boolean;
    /**
     * Lands on the overlay host; its scrim, surfaces box and live region
     * get `${testID}-backdrop`, `-surfaces`, `-live`.
     */
    testID?: string;
    children: Snippet;
  }

  let {
    size,
    defaults,
    adapters,
    isolatePage = true,
    testID,
    children,
  }: Props = $props();

  provideDefaults(() => ({ size, components: defaults as Record<string, Record<string, unknown>> }));
  // Live: an adapter the app swaps reaches the components already mounted.
  provideAdapters(() => adapters ?? {});
  // After the content, in the nearest positioned ancestor: the outermost
  // provider's overlay host (with the live region), which coordinates the
  // overlays below it. A nested provider renders none.
  const region = claimOverlayHost() ? provideLiveRegion() : undefined;
</script>

{@render children()}
{#if region}
  <OverlayHost {testID} {region} isolates={isolatePage} />
{/if}
