<script lang="ts" generics="T">
  import type { Snippet } from 'svelte';
  import { cx } from '../../cx';
  import type { IconSource } from '../../runes/icon/source';
  import { getMenu } from '../../runes/menu/context';
  import { createMenuItem } from '../../runes/menu/item.svelte';
  import type { PopupItemIntent } from '../shared/popup-list';
  import Icon from '../icon/Icon.svelte';
  import { resolveMenu, type MenuShared } from './styles';

  interface Props {
    /** What the item shows, and what typeahead matches. */
    title: string;
    /** Under the title, muted; it may wrap. */
    description?: string;
    /** A 16px glyph before the title, 8px from it. */
    icon?: IconSource;
    /** Before the title in place of an `icon`: an asset or an avatar in a 20px box. */
    leading?: Snippet;
    /** Beside the title, 8px from it: a Badge. */
    titleSuffix?: Snippet;
    /** After the title, 8px clear of it: a glyph (a check, a chevron) or shortcut text. */
    trailing?: Snippet;
    /** `negative` for a destructive action: red, with a red wash while active. @default 'none' */
    intent?: PopupItemIntent;
    /** Reported to the Menu's `onSelect` when the item is chosen. */
    value?: T;
    /** The item was chosen; the menu closes around it. */
    onClick?: () => void;
    /** @default false */
    isDisabled?: boolean;
    testID?: string;
    /** Custom content in place of the whole row; `title` still names it for typeahead. */
    children?: Snippet;
  }

  let {
    title,
    description,
    icon,
    leading,
    titleSuffix,
    trailing,
    intent = 'none',
    value,
    onClick,
    isDisabled = false,
    testID,
    children,
  }: Props = $props();

  const id = $props.id();

  const item = createMenuItem<MenuShared>(getMenu(), {
    id,
    isDisabled: () => isDisabled,
    text: () => title,
    onPick: () => {
      onClick?.();
      if (value !== undefined) {
        item.menu?.shared.onSelect(value);
      }
    },
  });
  // Outside a Menu the item still draws, in the defaults.
  const classes = $derived(item.menu?.shared.classes ?? resolveMenu({}));
</script>

<!-- Not focusable: focus stays on the menu, which names this row as its
     active descendant. -->
<!-- The list owns the keys. -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div
  {id}
  role="menuitem"
  tabindex="-1"
  class={cx(
    classes.item,
    classes.itemState[isDisabled ? 'disabled' : 'enabled'],
    !isDisabled && classes.itemIntent[intent]
  )}
  aria-disabled={isDisabled || undefined}
  data-active={item.activeBy}
  data-testid={testID}
  onclick={item.handleClick}
  onpointermove={item.handlePointerMove}
  onpointerdown={item.handlePointerDown}
  {@attach item.attach}
>
  {#if children}
    {@render children()}
  {:else}
    {#if icon}
      <span class={classes.itemIcon}><Icon source={icon} /></span>
    {:else if leading}
      <span class={classes.itemLeading}>{@render leading()}</span>
    {/if}
    <span class={classes.itemBody}>
      {#if titleSuffix}
        <span class={classes.itemTitleRow}>
          <span class={classes.itemTitle}>{title}</span>
          <span class={classes.itemTitleSuffix}>{@render titleSuffix()}</span>
        </span>
      {:else}
        <span class={classes.itemTitle}>{title}</span>
      {/if}
      {#if description}
        <span class={classes.itemDescription}>{description}</span>
      {/if}
    </span>
    {#if trailing}
      <span class={classes.itemTrailing}>{@render trailing()}</span>
    {/if}
  {/if}
</div>
