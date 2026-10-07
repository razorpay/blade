<script lang="ts">
  import type { Snippet } from 'svelte';
  import { getAdapters, provideAdapters, type BladeAdapters } from '../../adapters';
  import { provideDefaults } from '../../runes/defaults/defaults.svelte';
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
     * Modal: { variant: 'sheet' } }`. Nearer providers win; a component's
     * prop wins over all. Desktop differences are the components' own `d:`
     * classes, not values here.
     */
    defaults?: ComponentDefaults;
    /** App services (analytics, router, errors), merged over the enclosing ones. */
    adapters?: BladeAdapters;
    children: Snippet;
  }

  let { size, defaults, adapters, children }: Props = $props();

  // svelte-ignore state_referenced_locally
  provideDefaults(() => ({ size, components: defaults as Record<string, Record<string, unknown>> }));
  // svelte-ignore state_referenced_locally
  if (adapters) {
    provideAdapters({ ...getAdapters(), ...adapters });
  }
</script>

{@render children()}
