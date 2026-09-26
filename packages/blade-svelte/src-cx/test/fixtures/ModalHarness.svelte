<script lang="ts">
  import type { BackAnswer, DialogCloseSource } from '../../runes';
  import Modal from '../../components/modal/Modal.svelte';
  import type { ModalLookProp } from '../../components/modal/styles';
  import LayerHost from '../../components/layer/LayerHost.svelte';

  interface Props {
    withHost?: boolean;
    isOpen?: boolean;
    nestedOpen?: boolean;
    isDismissible?: boolean;
    onDismiss?: (source: DialogCloseSource) => void;
    onNestedDismiss?: (source: DialogCloseSource) => void;
    onBack?: () => BackAnswer;
    closeLabel?: string;
    withTitleSnippet?: boolean;
    withHeader?: boolean;
    /** Which content props the modal gets; `children` render raw. */
    content?: 'children' | 'body' | 'both';
    title?: string;
    accessibilityLabel?: string;
    placement?: 'center' | 'bottom' | 'top' | 'left' | 'right' | 'full';
    size?: 'default' | 'full';
    pace?: 'default' | 'snappy';
    look?: ModalLookProp['look'];
    className?: string;
  }

  let {
    withHost = false,
    isOpen = $bindable(false),
    nestedOpen = $bindable(false),
    isDismissible,
    onDismiss,
    onNestedDismiss,
    onBack,
    closeLabel = 'Close',
    withTitleSnippet = false,
    withHeader = false,
    content = 'children',
    title = 'Remove card',
    accessibilityLabel,
    placement,
    size,
    pace,
    look,
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

{#snippet subtitle()}
  <p data-testid="subtitle">Ending 1111</p>
{/snippet}

{#snippet rawContent({ close }: { close: () => void })}
  <button data-testid="first">First</button>
  <button data-testid="cancel" onclick={close}>Cancel</button>
{/snippet}

{#snippet bodyContent({ close }: { close: () => void })}
  <button data-testid="body-first">First</button>
  <button data-testid="body-cancel" onclick={close}>Cancel</button>
{/snippet}

<Modal
  bind:isOpen
  {isDismissible}
  {onDismiss}
  {onBack}
  {closeLabel}
  title={withTitleSnippet ? titleSnippet : title}
  header={withHeader ? subtitle : undefined}
  body={content === 'children' ? undefined : bodyContent}
  children={content === 'body' ? undefined : rawContent}
  {accessibilityLabel}
  {placement}
  {size}
  {pace}
  {look}
  class={className}
  testID="modal"
>
  {#snippet footer()}
    <button data-testid="last">Last</button>
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
