<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cx } from '../../cx';
  import { getTabs } from '../../runes/tabs/context';
  import { resolveTabs, type TabsClasses } from './styles';

  interface Props {
    /** The TabItem it belongs to. */
    value: string;
    testID?: string;
    class?: string;
    children: Snippet;
  }

  let { value, testID, class: className = '', children }: Props = $props();

  const tabs = getTabs<TabsClasses>();
  const classes = $derived(tabs?.shared ?? resolveTabs({}));
  const isSelected = $derived(tabs?.value === value);
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
  >
    {@render children()}
  </div>
{/if}
