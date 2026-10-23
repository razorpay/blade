<script lang="ts">
  import BladeProvider from '../../components/blade-provider/BladeProvider.svelte';
  import BottomSheet from '../../components/bottom-sheet/BottomSheet.svelte';
  import Drawer from '../../components/drawer/Drawer.svelte';
  import Menu from '../../components/menu/Menu.svelte';
  import Modal from '../../components/modal/Modal.svelte';
  import Popover from '../../components/popover/Popover.svelte';
  import DrawerBody from '../../components/modal-children/DrawerBody.svelte';

  // The props every overlay shares, per overlay: the element that takes
  // focus first, the analytics attributes and onOpenChange; Popover's and
  // Menu's trigger.
  interface Props {
    kind: 'modal' | 'sheet' | 'drawer' | 'popover' | 'menu';
    isOpen?: boolean;
    withFocusTarget?: boolean;
    isDisabled?: boolean;
    onOpenChange?: (change: { isOpen: boolean }) => void;
    bodyPadding?: 'spacing.0' | 'spacing.6';
  }

  let {
    kind,
    isOpen = $bindable(false),
    withFocusTarget = false,
    isDisabled = false,
    onOpenChange,
    bodyPadding,
  }: Props = $props();

  let target = $state<HTMLElement | null>(null);
  const initialFocusRef = $derived(withFocusTarget ? target : undefined);
</script>

{#snippet trigger({ isOpen: open }: { isOpen: boolean })}
  <button type="button" data-testid="open" data-open={open}>Open</button>
{/snippet}

{#snippet content({ close }: { close: () => void })}
  <button type="button" data-testid="first">First</button>
  <button type="button" data-testid="target" bind:this={target}>Target</button>
  <button type="button" data-testid="done" onclick={close}>Done</button>
{/snippet}

<BladeProvider testID="host">
  {#if kind !== 'popover' && kind !== 'menu'}
    <!-- Modal, BottomSheet and Drawer open from code: the owner's button. -->
    <button type="button" data-testid="open" onclick={() => (isOpen = true)}>Open</button>
  {/if}
  {#if kind === 'modal'}
    <Modal
      bind:isOpen
      {initialFocusRef}
      {onOpenChange}
      accessibilityLabel="Overlay"
      testID="overlay"
      data-analytics-section="fees"
      children={content}
    />
  {:else if kind === 'sheet'}
    <BottomSheet
      bind:isOpen
      {initialFocusRef}
      {onOpenChange}
      accessibilityLabel="Overlay"
      testID="overlay"
      data-analytics-section="fees"
      children={content}
    />
  {:else if kind === 'drawer'}
    <Drawer
      bind:isOpen
      {initialFocusRef}
      {onOpenChange}
      accessibilityLabel="Overlay"
      testID="overlay"
      data-analytics-section="fees"
    >
      {#snippet children({ close })}
        <DrawerBody padding={bodyPadding} testID="drawer-body">{@render content({ close })}</DrawerBody>
      {/snippet}
    </Drawer>
  {:else if kind === 'popover'}
    <Popover
      bind:isOpen
      children={trigger}
      {isDisabled}
      {initialFocusRef}
      {onOpenChange}
      accessibilityLabel="Overlay"
      testID="overlay"
      data-analytics-section="fees"
      body={content}
    />
  {:else}
    <Menu
      bind:isOpen
      children={trigger}
      {isDisabled}
      {onOpenChange}
      accessibilityLabel="Overlay"
      testID="overlay"
      data-analytics-section="fees"
      body={content}
    />
  {/if}
  <button type="button" data-testid="elsewhere">Elsewhere</button>
  <output data-testid="bound">{isOpen}</output>
</BladeProvider>
