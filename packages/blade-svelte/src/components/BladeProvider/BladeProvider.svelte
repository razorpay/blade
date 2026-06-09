<script lang="ts">
  import type { Snippet } from 'svelte';
  import {
    flattenThemeOverridesToVars,
    styleObjectToString,
    type ThemeOverrideTree,
    type SlotThemeMap,
  } from '@razorpay/blade-core/styles';
  import { setSlotThemeContext } from './bladeProviderContext';

  /**
   * BladeProvider — instance-level styling Options C & D (evaluation surfaces).
   *
   * **Option C (scoped theme):** `themeOverrides` is a partial, nested token tree
   * (same shape as Blade tokens). It is flattened to CSS variables and declared on
   * THIS wrapper element, so every Blade component inside inherits the override via
   * the natural CSS cascade — without repainting `:root`. Great for region/brand
   * theming ("make this whole drawer festive").
   *
   * **Option D (slot-keyed map):** `slotTheme` is published via context; components
   * opt in with a `themeKey` and resolve against it. Included for comparison — the
   * recommendation rejects the centralized taxonomy in favor of Option B's nested
   * `styleOverrides`.
   *
   * Recommended default remains Option B (per-instance `styleOverrides`, no provider
   * needed). See instance-level-styling-proposal §4 (Options C, D) and §6.
   */
  let {
    themeOverrides,
    slotTheme,
    children,
  }: {
    themeOverrides?: ThemeOverrideTree;
    slotTheme?: SlotThemeMap;
    children: Snippet;
  } = $props();

  // Option C: flatten the token override tree into scoped CSS variables.
  const scopedVars = $derived(flattenThemeOverridesToVars(themeOverrides));
  const scopedStyle = $derived(styleObjectToString(scopedVars));

  // Option D: publish the slot-keyed theme map to descendants (getter for reactivity).
  setSlotThemeContext(() => slotTheme);
</script>

<div data-blade-component="blade-provider" style={scopedStyle}>
  {@render children()}
</div>
