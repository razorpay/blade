<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cx } from '../../cx';
  import type { IconSource } from '../../runes/icon/source';
  import { getTabs } from '../../runes/tabs/context';
  import { createTabItem } from '../../runes/tabs/tabs.svelte';
  import Icon from '../icon/Icon.svelte';
  import { resolveTabs, type TabItemState, type TabsClasses } from './styles';

  interface Props {
    /** What Tabs' `value` becomes when this tab is picked; its TabPanel's `value`. */
    value: string;
    /**
     * Before the label: an icon (alone, it needs `accessibilityLabel`), or a
     * snippet with an asset (a logo, an avatar) in the icon's box, which
     * receives the tab's state.
     */
    leading?: IconSource | Snippet<[TabItemState]>;
    /** After the label: a Badge or a Counter, which may follow the tab's state. */
    trailing?: Snippet<[TabItemState]>;
    /** @default false */
    isDisabled?: boolean;
    /** A link that is a tab: it navigates as well as picks. */
    href?: string;
    onClick?: (event: MouseEvent) => void;
    /** Names an icon-only tab. */
    accessibilityLabel?: string;
    testID?: string;
    class?: string;
    /** The label; it receives the tab's state. */
    children?: Snippet<[TabItemState]>;
  }

  let {
    value,
    leading,
    trailing,
    isDisabled = false,
    href,
    onClick,
    accessibilityLabel,
    testID,
    class: className = '',
    children,
  }: Props = $props();

  const tab = createTabItem(getTabs<TabsClasses>(), {
    value: () => value,
    isDisabled: () => isDisabled,
  });
  // Outside Tabs the tab still draws, in the defaults.
  const classes = $derived(tab.tabs?.shared ?? resolveTabs({}));
  const state = $derived(
    isDisabled ? 'disabled' : tab.isSelected ? 'picked' : 'unpicked'
  );
  const snippetState: TabItemState = $derived({
    isSelected: tab.isSelected,
    isDisabled,
  });

  function handleClick(event: MouseEvent) {
    if (isDisabled) {
      event.preventDefault();
      return;
    }
    tab.handleClick();
    onClick?.(event);
  }
</script>

<svelte:element
  this={href ? 'a' : 'button'}
  type={href ? undefined : 'button'}
  href={isDisabled ? undefined : href}
  role="tab"
  id={tab.tabId}
  class={cx(classes.tab, classes.tabState[state], className)}
  tabindex={tab.isTabStop ? 0 : -1}
  aria-selected={tab.isSelected}
  aria-controls={tab.panelId}
  aria-disabled={isDisabled || undefined}
  aria-label={accessibilityLabel}
  disabled={href ? undefined : isDisabled || undefined}
  data-testid={testID}
  onclick={handleClick}
  onkeydown={tab.handleKeyDown}
  onfocus={tab.handleFocus}
  {@attach tab.attach}
>
  {#if typeof leading === 'function'}
    <span class={classes.leading}>{@render leading(snippetState)}</span>
  {:else if leading}
    <Icon source={leading} {...classes.icon} />
  {/if}
  {#if children}
    <span class={classes.label}>{@render children(snippetState)}</span>
  {/if}
  {@render trailing?.(snippetState)}
</svelte:element>
