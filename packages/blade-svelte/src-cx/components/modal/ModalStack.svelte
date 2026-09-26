<script lang="ts">
  import { hostStack } from '../../runes/modal/stack.svelte';
  import Modal from './Modal.svelte';
  import { getOverlays } from './overlays';
  import ModalPending from './ModalPending.svelte';

  // Renders the modals `openModal` asked for, one Modal each: the layer
  // stack, the inert page, focus, presence and the native sheet are all
  // Modal's. Mount it once, beside the LayerHost.
  const overlays = getOverlays();
  const mounted = hostStack(overlays);
</script>

{#each mounted.entries as entry (entry.id)}
  {@const { component: Content, props, options, control } = entry.content}
  {@const {
    title,
    closeLabel,
    pendingLabel,
    isDismissible,
    onBack,
    onDismiss,
    onLoadError: _onLoadError,
    role,
    accessibilityLabel,
    testID,
    class: className,
    look,
    ...styleProps
  } = options}
  <Modal
    isOpen={entry.phase === 'open'}
    {title}
    {closeLabel}
    {isDismissible}
    {onBack}
    {role}
    {accessibilityLabel}
    {testID}
    class={className}
    {look}
    onDismiss={(source) => {
      onDismiss?.(source);
      overlays.stack.dismiss(entry.id);
    }}
    onClosed={() => overlays.stack.closed(entry.id)}
    {...styleProps}
  >
    <!-- An opened component is body content: it gets the preset's padding. -->
    {#snippet body()}
      {#if Content}
        <Content {...props} modal={control} />
      {:else}
        <div role="status" aria-busy="true" aria-label={pendingLabel}>
          <ModalPending {...styleProps} />
        </div>
      {/if}
    {/snippet}
  </Modal>
{/each}
