<script lang="ts">
  import type { Snippet } from 'svelte';
  import {
    flattenThemeOverridesToVars,
    styleObjectToString,
    type ThemeOverrideTree,
  } from '@razorpay/blade-core/styles';

  /**
   * BladeProvider — instance-level styling Option C (scoped subtree theming).
   *
   * `themeOverrides` is a partial, nested token tree (same shape as Blade tokens).
   * It is flattened to CSS variables and declared on this wrapper element, so every
   * Blade component inside inherits the override via the natural CSS cascade — without
   * repainting `:root`. Great for region/brand theming ("make this whole drawer festive").
   *
   * Complements Option B's per-instance `styleOverrides`. See
   * instance-level-styling-proposal §4 (Option C) and §6.
   */
  let {
    themeOverrides,
    children,
  }: {
    themeOverrides?: ThemeOverrideTree;
    children: Snippet;
  } = $props();

  const scopedVars = $derived(flattenThemeOverridesToVars(themeOverrides));
  const scopedStyle = $derived(styleObjectToString(scopedVars));
</script>

<div data-blade-component="blade-provider" style={scopedStyle}>
  {@render children()}
</div>
