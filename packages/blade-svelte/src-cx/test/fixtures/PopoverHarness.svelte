<script lang="ts">
  import LayerHost from '../../components/layer/LayerHost.svelte';
  import { provideLayers } from '../../runes/layer/layers';
  import Menu from '../../components/menu/Menu.svelte';
  import Popover from '../../components/popover/Popover.svelte';

  interface Props {
    onSelect?: (item: string) => void;
    onOpenChange?: (isOpen: boolean) => void;
  }

  let { onSelect = () => undefined, onOpenChange }: Props = $props();

  provideLayers();
  const ITEMS = ['Edit', 'Archive', 'Delete'];
</script>

<main data-testid="page">
  <Popover accessibilityLabel="Fee details" testID="panel" {onOpenChange}>
    <button type="button">Fees</button>
    {#snippet content({ close })}
      <p>2% convenience fee</p>
      <button type="button" onclick={close}>Got it</button>
    {/snippet}
  </Popover>
  <Menu
    items={ITEMS}
    itemKey={(item) => item}
    itemLabel={(item) => item}
    isItemDisabled={(item) => item === 'Archive'}
    {onSelect}
    accessibilityLabel="Card actions"
    testID="menu"
  >
    <button type="button">More</button>
  </Menu>
  <button type="button" data-testid="elsewhere">Elsewhere</button>
</main>
<LayerHost testID="host" />
