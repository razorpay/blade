<script lang="ts">
  import type { Snippet } from 'svelte';
  import { analyticsAttributes, type AnalyticsAttributes } from '../../runes/dom/analytics';
  import { cx } from '../../cx';
  import { resolveDrawerBody } from './styles';

  // Blade's DrawerBody. A div with resolveDrawerBody's classes:
  // the overlay's scroll box.
  interface Props extends Partial<AnalyticsAttributes> {
    /**
     * Blade's `drawerPadding` all round, or none (content with its own
     * scroll box). Blade's DrawerBody has no `padding`: this follows
     * ModalBody's.
     * @default 'spacing.6'
     */
    padding?: 'spacing.0' | 'spacing.6';
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

  const classes = $derived(resolveDrawerBody({ padding }));
</script>

<div class={cx(classes.root, className)} data-testid={testID} {...analytics}>{@render children()}</div>
