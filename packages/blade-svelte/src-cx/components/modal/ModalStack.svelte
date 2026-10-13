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
    subtitle,
    closeLabel,
    pendingLabel,
    isDismissible,
    onDismiss,
    onLoadError: _onLoadError,
    role,
    accessibilityLabel,
    testID,
    class: className,
    ...styleProps
  } = options}
  <!--
    Open while the entry is; a close the modal makes itself (a dismissal,
    or `onDismiss`'s close) is written back as the stack's dismiss.
  -->
  <Modal
    bind:isOpen={
      () => entry.phase === 'open',
      (open) => {
        if (!open) overlays.stack.dismiss(entry.id);
      }
    }
    {title}
    {subtitle}
    {closeLabel}
    {isDismissible}
    {onDismiss}
    {role}
    {accessibilityLabel}
    {testID}
    class={className}
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
