<script lang="ts" generics="T">
  import type { Snippet } from 'svelte';
  import { cx } from '../../cx';
  import type { Placement } from '../../runes/layer/placement';
  import { provideMenu } from '../../runes/menu/context';
  import { createMenu } from '../../runes/menu/menu.svelte';
  import PopoverPanel from '../popover/PopoverPanel.svelte';
  import { resolveMenu, type MenuShared, type MenuStyleProps } from './styles';

  type Props = MenuStyleProps & {
    /** The trigger: a Button or an IconButton. */
    trigger: Snippet;
    /**
     * The MenuItems, in order, and anything else between them — a heading,
     * a Divider. Only MenuItems are items: the rest is outside the keyboard.
     * They mount while the menu is open.
     */
    children: Snippet;
    /** A MenuItem with a `value` was chosen: the menu closes and reports it. */
    onSelect?: (value: T) => void;
    onOpenChange?: (isOpen: boolean) => void;
    placement?: Placement;
    /** Names the menu. */
    accessibilityLabel: string;
    /** Lands on the menu. */
    testID?: string;
    class?: string;
  };

  let {
    trigger,
    children,
    onSelect,
    onOpenChange,
    placement = 'bottom-end',
    accessibilityLabel,
    testID,
    class: className = '',
    ...styleProps
  }: Props = $props();

  const uid = $props.id();
  const menuId = `${uid}-menu`;

  const classes = $derived(resolveMenu(styleProps));

  const menu = createMenu<MenuShared>({
    id: menuId,
    onOpenChange: (open) => onOpenChange?.(open),
    shared: () => ({
      classes,
      onSelect: (value) => onSelect?.(value as T),
    }),
  });
  provideMenu(menu);
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<span
  class={cx(classes.root, className)}
  onclick={menu.handleTriggerClick}
  onkeydown={menu.handleRootKeyDown}
  {@attach menu.root}
>
  {@render trigger()}
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
      {@render children()}
    </PopoverPanel>
  {/if}
</span>
