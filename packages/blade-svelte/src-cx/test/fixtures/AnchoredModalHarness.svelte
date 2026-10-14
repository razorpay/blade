<script lang="ts">
  import BladeProvider from '../../components/blade-provider/BladeProvider.svelte';
  import ActionList from '../../components/action-list/ActionList.svelte';
  import ActionListItem from '../../components/action-list/ActionListItem.svelte';
  import type { ComponentDefaults } from '../../components/defaults';
  import OverlayStack from '../../components/layer/OverlayStack.svelte';
  import Modal from '../../components/modal/Modal.svelte';
  import Tooltip from '../../components/tooltip/Tooltip.svelte';
  import { InfoIcon } from '../../icons';
  import type { DialogDismissEvent } from '../../runes/modal/dialog.svelte';
  import { provideLayers } from '../../runes/layer/layers';

  // Modal's popover and menu variants: a trigger, a floating panel (or a
  // sheet, through the provider's `presentation`), and an ActionList whose
  // rows are the menu's items.
  interface Props {
    defaults?: ComponentDefaults;
    onSelect?: (value: string) => void;
    onDismiss?: (event: DialogDismissEvent) => void;
    menuOpen?: boolean;
    /** The popover's title: a string, or a snippet with `richTitle`. */
    title?: string;
    richTitle?: boolean;
    withLeading?: boolean;
    withTooltip?: boolean;
    withLink?: boolean;
    isDisabled?: boolean;
  }

  let {
    defaults,
    onSelect,
    onDismiss,
    menuOpen = $bindable(false),
    title,
    richTitle = false,
    withLeading = false,
    withTooltip = false,
    withLink = false,
    isDisabled = false,
  }: Props = $props();

  provideLayers();
  const ITEMS = ['Edit', 'Archive', 'Delete'];
</script>

{#snippet titleSnippet()}<em data-testid="rich-title">Settlement</em> breakup{/snippet}

<BladeProvider {defaults}>
  <main data-testid="page">
    <Modal
      variant="popover"
      title={richTitle ? titleSnippet : title}
      leading={withLeading ? InfoIcon : undefined}
      accessibilityLabel="Fee details"
      {isDisabled}
      {onDismiss}
      testID="panel"
    >
      {#snippet trigger({ isOpen })}
        <button type="button" data-testid="fees" data-open={isOpen}>Fees</button>
      {/snippet}
      {#snippet body({ close })}
        <p>2% convenience fee</p>
        {#if withTooltip}
          <Tooltip content="Charged by your bank" testID="tip">
            <button type="button" data-testid="tip-trigger">Why?</button>
          </Tooltip>
        {/if}
        <button type="button" onclick={close}>Got it</button>
      {/snippet}
    </Modal>
    <Modal variant="menu" bind:isOpen={menuOpen} accessibilityLabel="Card actions" testID="menu">
      {#snippet trigger({ isOpen })}
        <button type="button" data-testid="more" data-open={isOpen}>More</button>
      {/snippet}
      {#snippet body()}
        <ActionList onChange={({ value }) => onSelect?.(String(value))} testID="actions">
          {#each ITEMS as item (item)}
            <ActionListItem
              value={item}
              title={item}
              isDisabled={item === 'Archive'}
              testID={item.toLowerCase()}
            />
          {/each}
          {#if withLink}
            <ActionListItem value="help" title="Help" href="#help" testID="help" />
          {/if}
        </ActionList>
      {/snippet}
    </Modal>
    <button type="button" data-testid="elsewhere">Elsewhere</button>
    <output data-testid="menu-bound">{menuOpen}</output>
  </main>
  <OverlayStack testID="host" />
</BladeProvider>
