<script lang="ts">
  import type { Snippet } from 'svelte';
  import { analyticsAttributes, type AnalyticsAttributes } from '../../runes/dom/analytics';
  import { cx } from '../../cx';
  import { resolveDrawerFooter } from './styles';

  // Blade's DrawerFooter. A div with resolveDrawerFooter's classes:
  // the caller lays out the actions in it.
  interface Props extends Partial<AnalyticsAttributes> {
    /** A hairline above the actions. @default true */
    showDivider?: boolean;
    testID?: string;
    class?: string;
    children: Snippet;
  }

  let {
    showDivider = true,
    testID,
    class: className = '',
    children,
    ...rest
  }: Props = $props();

  const analytics = $derived(analyticsAttributes(rest));

  const classes = $derived(resolveDrawerFooter({ showDivider }));
</script>

<div class={cx(classes.root, className)} data-testid={testID} {...analytics}>{@render children()}</div>
