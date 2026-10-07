<script lang="ts" generics="T">
  import type { Snippet } from 'svelte';
  import { cx } from '../../cx';
  import type { IconSource } from '../../runes/icon/source';
  import { getMenu } from '../../runes/menu/context';
  import { createMenuItem } from '../../runes/menu/item.svelte';
  import Icon from '../icon/Icon.svelte';
  import { resolveMenu, type MenuShared } from './styles';

  interface Props {
    /** What the item shows, and what typeahead matches. */
    title: string;
    /** A 16px glyph before the title, 8px from it. */
    icon?: IconSource;
    /** Before the title in place of an `icon`: an asset or an avatar in a 20px box. */
    leading?: Snippet;
    /** Beside the title, 8px from it: a Badge. */
    titleSuffix?: Snippet;
    /** After the title, 8px clear of it: a glyph (a check, a chevron) or shortcut text. */
    trailing?: Snippet;
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
    icon,
    leading,
    titleSuffix,
    trailing,
    value,
    onClick,
    isDisabled = false,
    testID,
    children,
  }: Props = $props();

  const item = createMenuItem<MenuShared>(getMenu(), {
    isDisabled: () => isDisabled,
    text: () => title,
    onSelect: () => {
      onClick?.();
      if (value !== undefined) {
        item.menu?.shared.onSelect(value);
      }
    },
  });
  // Outside a Menu the item still draws, in the defaults.
  const classes = $derived(item.menu?.shared.classes ?? resolveMenu({}));
</script>

<button
  type="button"
  role="menuitem"
  class={cx(classes.item, classes.itemState[isDisabled ? 'disabled' : 'enabled'])}
  tabindex="-1"
  aria-disabled={isDisabled || undefined}
  data-testid={testID}
  onclick={item.handleClick}
  onpointermove={item.handlePointerMove}
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
    {#if titleSuffix}
      <span class={classes.itemTitleRow}>
        <span class={classes.itemTitle}>{title}</span>
        <span class={classes.itemTitleSuffix}>{@render titleSuffix()}</span>
      </span>
    {:else}
      <span class={classes.itemTitle}>{title}</span>
    {/if}
    {#if trailing}
      <span class={classes.itemTrailing}>{@render trailing()}</span>
    {/if}
  {/if}
</button>
