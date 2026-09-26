<script lang="ts" generics="T">
  import type { Snippet } from 'svelte';
  import { cx } from '../../cx';
  import type { IconSource } from '../../runes/icon/source';
  import type { Placement } from '../../runes/layer/placement';
  import { createMenu } from '../../runes/menu/menu.svelte';
  import Icon from '../icon/Icon.svelte';
  import PopoverPanel from '../popover/PopoverPanel.svelte';
  import { resolveMenu, type MenuStyleProps } from './styles';

  type Props = MenuStyleProps & {
    items: readonly T[];
    /** A stable key per item. */
    itemKey: (item: T) => string;
    /** The item's text: what it shows, and what typeahead matches. */
    itemLabel: (item: T) => string;
    itemIcon?: (item: T) => IconSource | undefined;
    isItemDisabled?: (item: T) => boolean;
    /** A choice is an act: the menu closes and reports it. */
    onSelect: (item: T) => void;
    onOpenChange?: (isOpen: boolean) => void;
    placement?: Placement;
    /** Names the menu. */
    accessibilityLabel: string;
    /** Lands on the menu. */
    testID?: string;
    class?: string;
    /** The trigger: a Button or an IconButton. */
    children: Snippet;
    /** Replaces an item's icon and label. */
    item?: Snippet<[T]>;
  };

  let {
    items,
    itemKey,
    itemLabel,
    itemIcon,
    isItemDisabled,
    onSelect,
    onOpenChange,
    placement = 'bottom-end',
    accessibilityLabel,
    testID,
    class: className = '',
    children,
    item: itemContent,
    ...styleProps
  }: Props = $props();

  const uid = $props.id();
  const menuId = `${uid}-menu`;

  const classes = $derived(resolveMenu(styleProps));

  const menu = createMenu<T>({
    id: menuId,
    items: () => items,
    itemLabel: (item) => itemLabel(item),
    isItemDisabled: (item) => Boolean(isItemDisabled?.(item)),
    onSelect: (item) => onSelect(item),
    onOpenChange: (open) => onOpenChange?.(open),
  });
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<span
  class={cx(classes.root, className)}
  onclick={menu.handleTriggerClick}
  onkeydown={menu.handleRootKeyDown}
  {@attach menu.root}
>
  {@render children()}
  {#if menu.isOpen && menu.anchor}
    <PopoverPanel
      id={menuId}
      anchor={menu.anchor}
      {placement}
      {classes}
      role="menu"
      {accessibilityLabel}
      isFocusMoved={false}
      {testID}
      onDismiss={menu.close}
      onKeyDown={menu.handleKey}
    >
      {#each items as entry, index (itemKey(entry))}
        {@const isDisabled = Boolean(isItemDisabled?.(entry))}
        <button
          type="button"
          role="menuitem"
          class={cx(
            classes.item,
            classes.itemState[isDisabled ? 'disabled' : 'enabled']
          )}
          tabindex="-1"
          aria-disabled={isDisabled || undefined}
          data-index={index}
          onclick={() => menu.select(entry)}
          onpointermove={() => menu.hoverItem(index)}
        >
          {#if itemContent}
            {@render itemContent(entry)}
          {:else}
            {#if itemIcon?.(entry)}
              <span class={classes.itemIcon}>
                <Icon source={itemIcon(entry) as IconSource} />
              </span>
            {/if}
            {itemLabel(entry)}
          {/if}
        </button>
      {/each}
    </PopoverPanel>
  {/if}
</span>
