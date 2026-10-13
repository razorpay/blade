<script lang="ts">
  import type { DialogDismissEvent } from '../../runes';
  import Modal from '../../components/modal/Modal.svelte';
  import LayerHost from '../../components/layer/LayerHost.svelte';
  import { InfoIcon } from '../../icons';

  interface Props {
    withHost?: boolean;
    isOpen?: boolean;
    nestedOpen?: boolean;
    isDismissible?: boolean;
    onDismiss?: (event: DialogDismissEvent) => void;
    onNestedDismiss?: (event: DialogDismissEvent) => void;
    closeLabel?: string;
    withTitleSnippet?: boolean;
    withHeader?: boolean;
    /** Which content props the modal gets; `children` render raw. */
    content?: 'children' | 'body' | 'both';
    title?: string;
    subtitle?: string;
    accessibilityLabel?: string;
    size?: 'small' | 'medium' | 'large' | 'full';
    pace?: 'default' | 'snappy';
    variant?: 'modal' | 'sheet' | 'drawer' | 'left-drawer';
    /** Fills the chrome snippet: a badge above the panel, and a close. */
    withChrome?: boolean;
    /** Fills the header's slots: `leading` (an icon, or an asset with 'leading'), `titleSuffix`, `trailing`. */
    withSlots?: 'icon' | 'leading';
    showBackButton?: boolean;
    onBackButtonClick?: (event: { close: () => void }) => void;
    backLabel?: string;
    className?: string;
  }

  let {
    withHost = false,
    isOpen = $bindable(false),
    nestedOpen = $bindable(false),
    isDismissible,
    onDismiss,
    onNestedDismiss,
    closeLabel = 'Close',
    withTitleSnippet = false,
    withHeader = false,
    content = 'children',
    title = 'Remove card',
    subtitle,
    accessibilityLabel,
    size,
    pace,
    variant,
    withChrome = false,
    withSlots,
    showBackButton,
    onBackButtonClick,
    backLabel,
    className,
  }: Props = $props();
</script>

<div data-testid="frame">
  <main data-testid="page">
    <button data-testid="trigger" onclick={() => (isOpen = true)}>Open</button>
  </main>
  {#if withHost}
    <LayerHost testID="host" />
  {/if}
</div>

{#snippet titleSnippet()}
  <h2>Remove <em>this</em> card</h2>
{/snippet}

{#snippet headerContent({
  title,
  subtitle,
  close,
}: {
  title: import('svelte').Snippet;
  subtitle: import('svelte').Snippet;
  close: () => void;
})}
  <div data-testid="title-row" class="flex items-center gap-2">
    <button data-testid="header-back" onclick={close}>Back</button>
    {@render title()}
    <span data-testid="badge-beside">Default</span>
  </div>
  {@render subtitle()}
  <p data-testid="subtitle">Ending 1111</p>
{/snippet}

{#snippet rawContent({ close }: { close: () => void })}
  <button data-testid="first">First</button>
  <button data-testid="cancel" onclick={close}>Cancel</button>
{/snippet}

{#snippet chromeContent({ close }: { close: () => void })}
  <div data-testid="badge" class="absolute bottom-full">Badge</div>
  <button data-testid="chrome-close" onclick={close}>Done</button>
{/snippet}

{#snippet leadingAsset()}
  <img data-testid="logo" alt="" />
{/snippet}

{#snippet suffix()}
  <span data-testid="count">3</span>
{/snippet}

{#snippet trailingAction({ close }: { close: () => void })}
  <button data-testid="trailing-action" onclick={close}>Help</button>
{/snippet}

{#snippet bodyContent({ close }: { close: () => void })}
  <button data-testid="body-first">First</button>
  <button data-testid="body-cancel" onclick={close}>Cancel</button>
{/snippet}

<Modal
  bind:isOpen
  {showBackButton}
  {onBackButtonClick}
  {backLabel}
  {isDismissible}
  {onDismiss}
  {closeLabel}
  title={withTitleSnippet ? titleSnippet : title}
  {subtitle}
  header={withHeader ? headerContent : undefined}
  body={content === 'children' ? undefined : bodyContent}
  children={content === 'body' ? undefined : rawContent}
  {accessibilityLabel}
  {size}
  {pace}
  {variant}
  chrome={withChrome ? chromeContent : undefined}
  leading={withSlots === 'icon' ? InfoIcon : withSlots === 'leading' ? leadingAsset : undefined}
  titleSuffix={withSlots ? suffix : undefined}
  trailing={withSlots ? trailingAction : undefined}
  class={className}
  testID="modal"
>
  {#snippet footer({ close })}
    <button data-testid="last" onclick={close}>Last</button>
  {/snippet}
</Modal>

<Modal
  bind:isOpen={nestedOpen}
  onDismiss={onNestedDismiss}
  title="Are you sure?"
  closeLabel="Close"
  testID="nested"
>
  <button data-testid="nested-ok">OK</button>
</Modal>
