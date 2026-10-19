<script lang="ts">
  import BladeProvider from '../../components/blade-provider/BladeProvider.svelte';
  import ActionList from '../../components/action-list/ActionList.svelte';
  import ActionListItem from '../../components/action-list/ActionListItem.svelte';
  import type { ComponentDefaults } from '../../components/defaults';
  import Menu from '../../components/menu/Menu.svelte';
  import Popover from '../../components/popover/Popover.svelte';
  import Tooltip from '../../components/tooltip/Tooltip.svelte';
  import { InfoIcon } from '../../icons';
  import type { DialogDismissEvent } from '../../runes/modal/dialog.svelte';

  // Modal's popover and menu variants: a trigger, a floating panel (or a
  // sheet, through the provider's `presentation`). The menu holds an
  // ActionList whose pick closes it: the two are not coupled.
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
    /** The popover's `header` snippet, around its title and a subtitle. */
    withHeader?: boolean;
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
    withHeader = false,
  }: Props = $props();

  const ITEMS = ['Edit', 'Archive', 'Delete'];
</script>

{#snippet headerContent({
  title: drawn,
  subtitle: drawnSubtitle,
  close,
}: {
  title: import('svelte').Snippet;
  subtitle: import('svelte').Snippet;
  close: () => void;
})}
  <div data-testid="title-row" class="flex items-center gap-2">
    <button data-testid="header-back" onclick={close}>Back</button>
    {@render drawn()}
    <span data-testid="badge-beside">Default</span>
  </div>
  {@render drawnSubtitle()}
{/snippet}

{#snippet titleSnippet()}<em data-testid="rich-title">Settlement</em> breakup{/snippet}

<BladeProvider {defaults} testID="host">
  <main data-testid="page">
    <Popover
      title={richTitle ? titleSnippet : title}
      leading={withLeading ? InfoIcon : undefined}
      accessibilityLabel="Fee details"
      subtitle={withHeader ? 'Visa' : undefined}
      header={withHeader ? headerContent : undefined}
      {isDisabled}
      {onDismiss}
      testID="panel"
    >
      {#snippet children({ isOpen })}
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
    </Popover>
    <Menu bind:isOpen={menuOpen} accessibilityLabel="Card actions" testID="menu">
      {#snippet children({ isOpen })}
        <button type="button" data-testid="more" data-open={isOpen}>More</button>
      {/snippet}
      {#snippet body({ close })}
        <ActionList
          onPick={({ value }) => {
            onSelect?.(String(value));
            close();
          }}
          accessibilityLabel="Card actions"
          testID="actions"
        >
          {#each ITEMS as item (item)}
            <ActionListItem
              value={item}
              title={item}
              isDisabled={item === 'Archive'}
              testID={item.toLowerCase()}
            />
          {/each}
          {#if withLink}
            <ActionListItem value="help" title="Help" href="#help" onClick={close} testID="help" />
          {/if}
        </ActionList>
      {/snippet}
    </Menu>
    <button type="button" data-testid="elsewhere">Elsewhere</button>
    <output data-testid="menu-bound">{menuOpen}</output>
  </main>
</BladeProvider>
