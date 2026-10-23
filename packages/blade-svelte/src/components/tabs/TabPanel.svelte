<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cx } from '../../cx';
  import { analyticsAttributes, type AnalyticsAttributes } from '../../runes/dom/analytics';
  import { getTabs } from '../../runes/tabs/context';
  import { resolveTabs, type TabsClasses } from './styles';

  interface Props extends Partial<AnalyticsAttributes> {
    /** The TabItem it belongs to. */
    value: string;
    testID?: string;
    class?: string;
    children: Snippet;
  }

  let { value, testID, class: className = '', children, ...rest }: Props = $props();

  const tabs = getTabs<TabsClasses>();
  const classes = $derived(tabs?.shared ?? resolveTabs({}));
  const isSelected = $derived(tabs?.value === value);
  const analytics = $derived(analyticsAttributes(rest));
</script>

<!-- Blade: every panel stays mounted, hidden, unless the tabs are lazy. -->
{#if isSelected || !tabs?.isLazy}
  <div
    role="tabpanel"
    id={tabs?.panelId(value)}
    aria-labelledby={tabs?.tabId(value)}
    class={cx(classes.panel, className)}
    hidden={!isSelected}
    tabindex="0"
    data-testid={testID}
    {...analytics}
  >
    {@render children()}
  </div>
{/if}
