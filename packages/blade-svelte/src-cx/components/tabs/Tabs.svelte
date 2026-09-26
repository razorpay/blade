<script lang="ts" generics="T">
  import type { Snippet } from 'svelte';
  import { cx } from '../../cx';
  import { createTabs } from '../../runes/tabs/tabs.svelte';
  import { resolveTabs, type TabsStyleProps } from './styles';

  type Props = TabsStyleProps & {
    items: readonly T[];
    /** A stable key per item; it is also the value. */
    itemKey: (item: T) => string;
    itemLabel: (item: T) => string;
    isItemDisabled?: (item: T) => boolean;
    /** The picked item's key: initial, bound, or host-driven. Defaults to the first enabled tab. */
    value?: string;
    onChange?: (value: string) => void;
    /** `manual`: arrows only move focus, Enter or Space picks. */
    activation?: 'automatic' | 'manual';
    /** Names the tablist. */
    accessibilityLabel: string;
    testID?: string;
    class?: string;
    /** The picked tab's panel. */
    children: Snippet<[T]>;
    /** Replaces a tab's label. */
    tab?: Snippet<[T]>;
  };

  let {
    items,
    itemKey,
    itemLabel,
    isItemDisabled,
    value = $bindable(),
    onChange,
    activation = 'automatic',
    accessibilityLabel,
    testID,
    class: className = '',
    children,
    tab: tabContent,
    ...styleProps
  }: Props = $props();

  const uid = $props.id();
  const classes = $derived(resolveTabs(styleProps));

  // A tablist always has one tab picked.
  // svelte-ignore state_referenced_locally
  if (value === undefined) {
    const first = items.find((item) => !isItemDisabled?.(item));
    value = first && itemKey(first);
  }

  // svelte-ignore state_referenced_locally
  const tablist = createTabs<T>({
    id: uid,
    items: () => items,
    itemKey,
    isItemDisabled,
    value: () => value,
    onValue: (next) => {
      value = next;
    },
    onChange: (next) => onChange?.(next),
    activation,
  });
  const picked = $derived(tablist.picked);
  const pick = $derived(tablist.pick);
</script>

{#snippet tabs()}
  {#each items as item, index (itemKey(item))}
    {@const isPicked = item === picked}
    {@const isDisabled = Boolean(isItemDisabled?.(item))}
    <button
      type="button"
      role="tab"
      id={tablist.tabId(item)}
      class={cx(
        classes.tab,
        isDisabled
          ? classes.disabled
          : classes.pick[isPicked ? 'picked' : 'unpicked']
      )}
      tabindex={index === tablist.stop ? 0 : -1}
      aria-selected={isPicked}
      aria-controls={isPicked ? tablist.panelId(item) : undefined}
      aria-disabled={isDisabled || undefined}
      data-index={index}
      onclick={() => tablist.select(item)}
      onblur={() => tablist.clearActive()}
    >
      {#if tabContent}{@render tabContent(item)}{:else}{itemLabel(item)}{/if}
    </button>
  {/each}
{/snippet}

<div class={cx(classes.root, className)} data-testid={testID}>
  <!-- svelte-ignore a11y_interactive_supports_focus -->
  <div
    role="tablist"
    class={classes.list}
    aria-label={accessibilityLabel}
    onkeydown={tablist.handleKeyDown}
    {@attach tablist.attach}
  >
    {@render tabs()}
    {#if styleProps.layout === 'fill' && pick.index >= 0}
      <span
        class="pointer-events-none absolute bottom-0 left-0 h-0.5 [width:calc(100%/var(--tab-count))] [translate:calc(var(--tab-index)*100%)_0] border-t-thicker border-solid border-interactive-neutral-highlighted transition-transform duration-quick ease-standard motion-reduce:transition-none"
        style:--tab-index={pick.index}
        style:--tab-count={pick.count}
        aria-hidden="true"
      ></span>
    {/if}
  </div>
  {#if picked}
    {#key itemKey(picked)}
      <div
        role="tabpanel"
        id={tablist.panelId(picked)}
        class={classes.panel}
        aria-labelledby={tablist.tabId(picked)}
        tabindex="0"
      >
        {@render children(picked)}
      </div>
    {/key}
  {/if}
</div>
