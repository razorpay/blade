<script lang="ts">
  import LayerHost from '../../components/layer/LayerHost.svelte';
  import { provideLayers } from '../../runes/layer/layers';
  import Menu from '../../components/menu/Menu.svelte';
  import MenuItem from '../../components/menu/MenuItem.svelte';
  import Popover from '../../components/popover/Popover.svelte';

  interface Props {
    onSelect?: (item: string) => void;
    onOpenChange?: (change: { isOpen: boolean }) => void;
    onMenuOpenChange?: (change: { isOpen: boolean }) => void;
    menuOpen?: boolean;
  }

  let {
    onSelect = () => undefined,
    onOpenChange,
    onMenuOpenChange,
    menuOpen = $bindable(false),
  }: Props = $props();

  provideLayers();
  const ITEMS = ['Edit', 'Archive', 'Delete'];
</script>

<main data-testid="page">
  <Popover accessibilityLabel="Fee details" testID="panel" {onOpenChange}>
    {#snippet children({ isOpen })}<button type="button" data-testid="fees" data-open={isOpen}>Fees</button>{/snippet}
    {#snippet content({ close })}
      <p>2% convenience fee</p>
      <button type="button" onclick={close}>Got it</button>
    {/snippet}
  </Popover>
  <Menu
    {onSelect}
    bind:isOpen={menuOpen}
    onOpenChange={onMenuOpenChange}
    accessibilityLabel="Card actions"
    testID="menu"
  >
    {#snippet children({ isOpen })}
      <button type="button" data-testid="more" data-open={isOpen}>More</button>
    {/snippet}
    {#snippet content()}
      {#each ITEMS as item (item)}
        <MenuItem value={item} title={item} isDisabled={item === 'Archive'} />
      {/each}
    {/snippet}
  </Menu>
  <button type="button" data-testid="elsewhere">Elsewhere</button>
  <output data-testid="menu-bound">{menuOpen}</output>
</main>
<LayerHost testID="host" />
