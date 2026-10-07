<script lang="ts" generics="T">
  import type { Snippet } from 'svelte';
  import { cx } from '../../cx';
  import type { Placement } from '../../runes/layer/placement';
  import { provideMenu } from '../../runes/menu/context';
  import { createMenu } from '../../runes/menu/menu.svelte';
  import PopoverPanel from '../popover/PopoverPanel.svelte';
  import { resolveMenu, type MenuShared, type MenuStyleProps } from './styles';

  type Props = MenuStyleProps & {
    /**
     * The trigger: a Button or an IconButton. The wrapper around it opens
     * the menu, so it wires nothing; `isOpen` is there to read.
     */
    trigger: Snippet<[{ isOpen: boolean }]>;
    /**
     * The MenuItems, in order, and anything else between them — a heading,
     * a Divider. Only MenuItems are items: the rest is outside the keyboard.
     * They mount while the menu is open.
     */
    children: Snippet;
    /** A MenuItem with a `value` was chosen: the menu closes and reports it. */
    onSelect?: (value: T) => void;
    /**
     * Whether the menu shows: bindable, or a value the host keeps driving.
     * @default false
     */
    isOpen?: boolean;
    onOpenChange?: (change: { isOpen: boolean }) => void;
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
    isOpen = $bindable(false),
    onOpenChange,
    placement = 'bottom-start',
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
    isOpen: () => isOpen,
    onValue: (next) => {
      isOpen = next;
    },
    onOpenChange: (open) => onOpenChange?.({ isOpen: open }),
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
  {@render trigger({ isOpen: menu.isOpen })}
  {#if menu.isOpen && menu.anchor}
    <PopoverPanel
      id={menuId}
      anchor={menu.anchor}
      {placement}
      {classes}
      role="menu"
      {accessibilityLabel}
      isFocusMoved={false}
      focusOwner={menu.focusOwner}
      activeDescendant={menu.activeId}
      {testID}
      onDismiss={menu.close}
      onKeyDown={menu.handleKey}
    >
      {@render children()}
    </PopoverPanel>
  {/if}
</span>
