<script lang="ts">
  import BladeProvider from '../../components/blade-provider/BladeProvider.svelte';
  import type { DialogDismissEvent } from '../../runes/modal/dialog.svelte';
  // A surface the harness picks (Modal, BottomSheet, Drawer), with its own
  // parts composed in it.
  import Modal from '../../components/modal/Modal.svelte';
  import BottomSheet from '../../components/bottom-sheet/BottomSheet.svelte';
  import Drawer from '../../components/drawer/Drawer.svelte';
  import {
    BottomSheetBody,
    BottomSheetFooter,
    BottomSheetHeader,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    ModalBody,
    ModalFooter,
    ModalHeader,
  } from '../../components/modal-children';
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
    /** The sheet's header: Blade's only overlay header with a back button. */
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

{#snippet page()}
<main data-testid="page">
  <button data-testid="trigger" onclick={() => (isOpen = true)}>Open</button>
</main>
{/snippet}

<div data-testid="frame">
  {#if withHost}
    <BladeProvider testID="host">{@render page()}</BladeProvider>
  {:else}
    {@render page()}
  {/if}
</div>

{#snippet titleSnippet()}
  <h2>Remove <em>this</em> card</h2>
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

{#snippet footerContent({ close }: { close: () => void })}
  <button data-testid="last" onclick={close}>Last</button>
{/snippet}

{#snippet bodyContent({ close }: { close: () => void })}
  <button data-testid="body-first">First</button>
  <button data-testid="body-cancel" onclick={close}>Cancel</button>
{/snippet}

{#snippet sections({ close }: { close: () => void })}
  {@const head = {
    title: withTitleSnippet ? titleSnippet : title,
    subtitle,
    leading: withSlots === 'icon' ? InfoIcon : withSlots === 'leading' ? leadingAsset : undefined,
    titleSuffix: withSlots ? suffix : undefined,
    // The header hands `trailing` the overlay's close.
    trailing: withSlots ? trailingAction : undefined,
  }}
  {#if variant === 'sheet'}
    <BottomSheetHeader
      {...head}
      {showBackButton}
      onBackButtonClick={() => onBackButtonClick?.({ close })}
      {backLabel}
    />
  {:else if variant === 'drawer' || variant === 'left-drawer'}
    <DrawerHeader {...head} />
  {:else}
    <ModalHeader {...head} />
  {/if}
  {#if content !== 'body'}
    {@render rawContent({ close })}
  {:else if variant === 'sheet'}
    <BottomSheetBody>{@render bodyContent({ close })}</BottomSheetBody>
  {:else if variant === 'drawer' || variant === 'left-drawer'}
    <DrawerBody>{@render bodyContent({ close })}</DrawerBody>
  {:else}
    <ModalBody>{@render bodyContent({ close })}</ModalBody>
  {/if}
  {#if variant === 'sheet'}
    <BottomSheetFooter>{@render footerContent({ close })}</BottomSheetFooter>
  {:else if variant === 'drawer' || variant === 'left-drawer'}
    <DrawerFooter>{@render footerContent({ close })}</DrawerFooter>
  {:else}
    <ModalFooter>{@render footerContent({ close })}</ModalFooter>
  {/if}
{/snippet}

{#if variant === 'sheet'}
  <BottomSheet
    bind:isOpen
    {isDismissible}
    {onDismiss}
    {closeLabel}
    {accessibilityLabel}
    {pace}
    chrome={withChrome ? chromeContent : undefined}
    class={className}
    testID="modal"
    children={sections}
  />
{:else if variant === 'drawer' || variant === 'left-drawer'}
  <Drawer
    bind:isOpen
    side={variant === 'left-drawer' ? 'left' : 'right'}
    {isDismissible}
    {onDismiss}
    {closeLabel}
    {accessibilityLabel}
    {pace}
    chrome={withChrome ? chromeContent : undefined}
    class={className}
    testID="modal"
    children={sections}
  />
{:else}
  <Modal
    bind:isOpen
    {isDismissible}
    {onDismiss}
    {closeLabel}
    {accessibilityLabel}
    {size}
    {pace}
    chrome={withChrome ? chromeContent : undefined}
    class={className}
    testID="modal"
    children={sections}
  />
{/if}

<Modal bind:isOpen={nestedOpen} onDismiss={onNestedDismiss} closeLabel="Close" testID="nested">
  <ModalHeader title="Are you sure?" />
  <button data-testid="nested-ok">OK</button>
</Modal>
