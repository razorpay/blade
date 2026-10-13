<script lang="ts">
  import { getMenu } from '../../runes/menu/context';
  import { resolveMenu, type MenuShared } from './styles';

  // React's MenuDivider, Figma's _Menu Item separator: a hairline between
  // groups of MenuItems, 1px in from the panel's edges. Not an item: the
  // keys pass over it.
  interface Props {
    testID?: string;
  }

  let { testID }: Props = $props();

  const menu = getMenu<MenuShared>();
  // Outside a Menu the divider still draws, in the defaults.
  const classes = $derived(menu?.shared.classes ?? resolveMenu({}));
</script>

<div class={classes.divider} role="separator" data-testid={testID}></div>
