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
     * dropdown takeover (`presentDropdown`), and the toast queue a
     * ToastContainer under it shows (`toasts`) (`BladeAdapters`).
     * `null` unsets the enclosing one for this subtree.
     */
    adapters?: BladeAdaptersOverride;
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
  <OverlayHost {testID} {region} />
{/if}
