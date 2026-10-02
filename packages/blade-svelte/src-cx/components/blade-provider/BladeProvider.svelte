<script lang="ts">
  import type { Snippet } from 'svelte';
  import { getAdapters, provideAdapters, type BladeAdapters } from '../../adapters';
  import type { Breakpoints } from '../../runes/defaults/breakpoints.svelte';
  import { provideDefaults } from '../../runes/defaults/defaults.svelte';
  import type { Responsive } from '../../runes/defaults/responsive';
  import type { ComponentDefaults, DefaultSize } from '../defaults';

  interface Props {
    /**
     * The size every sized control takes (Button, the inputs, Checkbox,
     * RadioGroup, Tabs…), snapped to the nearest size each one has. A
     * component's own entry in `defaults` and its own prop win over it.
     */
    size?: Responsive<DefaultSize>;
    /**
     * Per component: default style props, each optionally per breakpoint —
     * `{ Button: { color: 'neutral' }, Modal: { variant: { base: 'sheet', m:
     * 'modal' } } }`. Nearer providers win; a component's prop wins over all.
     */
    defaults?: ComponentDefaults;
    /**
     * The breakpoint widths, in px, for values given per breakpoint. Omit
     * to use the enclosing provider's, else the stylesheet's
     * (`--blade-breakpoint-*`), else Blade's. They should match the preset's
     * `m:` variants, which a runtime value cannot move.
     */
    breakpoints?: Breakpoints;
    /** App services (analytics, router, errors), merged over the enclosing ones. */
    adapters?: BladeAdapters;
    children: Snippet;
  }

  let { size, defaults, breakpoints, adapters, children }: Props = $props();

  // svelte-ignore state_referenced_locally
  provideDefaults(
    () => ({ size, components: defaults as Record<string, Record<string, unknown>> }),
    breakpoints === undefined ? undefined : () => breakpoints
  );
  // svelte-ignore state_referenced_locally
  if (adapters) {
    provideAdapters({ ...getAdapters(), ...adapters });
  }
</script>

{@render children()}
