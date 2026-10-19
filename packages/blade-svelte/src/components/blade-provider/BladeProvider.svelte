<script lang="ts">
  import type { Snippet } from 'svelte';
  import { provideAdapters, type BladeAdaptersOverride } from '../../adapters';
  import { provideLiveRegion } from '../../runes/announce/live-region.svelte';
  import { provideDefaults } from '../../runes/defaults/defaults.svelte';
  import { claimOverlayHost } from '../../runes/layer/host.svelte';
  import { getToasts } from '../toast/toasts';
  import ToastStack from '../toast/ToastStack.svelte';
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
     * ToastStack: { placement: 'top' } }`. Nearer providers win; a component's
     * prop wins over all. Desktop differences are the components' own `d:`
     * classes, not values here.
     */
    defaults?: ComponentDefaults;
    /**
     * App services, merged over the enclosing ones and kept live: analytics,
     * router, errors, haptics, the screen-reader announcer, the locale, the
     * dropdown takeover (`presentDropdown`), and the toast queue this
     * provider renders (`toasts`, read once at mount) (`BladeAdapters`).
     * `null` unsets the enclosing one for this subtree.
     */
    adapters?: BladeAdaptersOverride;
    /**
     * Localized; names the toasts' region for a screen reader.
     * @default 'Notifications'
     */
    toastsLabel?: string;
    /**
     * Lands on the overlay host; its scrim, surfaces box, toasts and live
     * region get `${testID}-backdrop`, `-surfaces`, `-toasts`, `-live`.
     */
    testID?: string;
    children: Snippet;
  }

  let {
    size,
    defaults,
    adapters,
    toastsLabel = 'Notifications',
    testID,
    children,
  }: Props = $props();

  provideDefaults(() => ({ size, components: defaults as Record<string, Record<string, unknown>> }));
  // Live: an adapter the app swaps reaches the components already mounted.
  provideAdapters(() => adapters ?? {});
  // After the content, in the nearest positioned ancestor: the outermost
  // provider's overlay host (with the toasts and the live region), which
  // coordinates the overlays below it; a nested provider renders a toast
  // stack only for a Blade queue of its own, into the enclosing host. The
  // queue is read once, here.
  const claim = claimOverlayHost(getToasts());
  const region = claim.host ? provideLiveRegion() : undefined;
</script>

{@render children()}
{#if region}
  <OverlayHost {toastsLabel} {testID} {region} toasts={claim.toasts} />
{:else if claim.toasts}
  <ToastStack
    queue={claim.toasts}
    accessibilityLabel={toastsLabel}
    testID={testID ? `${testID}-toasts` : undefined}
  />
{/if}
