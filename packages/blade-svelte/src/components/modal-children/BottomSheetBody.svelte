<script lang="ts">
  import type { Snippet } from 'svelte';
  import { analyticsAttributes, type AnalyticsAttributes } from '../../runes/dom/analytics';
  import { cx } from '../../cx';
  import { resolveBottomSheetBody } from './styles';

  // Blade's BottomSheetBody. A div with resolveBottomSheetBody's classes:
  // the overlay's scroll box.
  interface Props extends Partial<AnalyticsAttributes> {
    /** Blade's tokens: all round, or none (content with its own scroll box). @default 'spacing.5' */
    padding?: 'spacing.0' | 'spacing.5';
    testID?: string;
    class?: string;
    children: Snippet;
  }

  let {
    padding,
    testID,
    class: className = '',
    children,
    ...rest
  }: Props = $props();

  const analytics = $derived(analyticsAttributes(rest));

  const classes = $derived(resolveBottomSheetBody({ padding }));
</script>

<div class={cx(classes.root, className)} data-testid={testID} {...analytics}>{@render children()}</div>
