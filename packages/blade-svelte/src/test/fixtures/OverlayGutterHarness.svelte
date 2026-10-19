<script lang="ts">
  import BladeProvider from '../../components/blade-provider/BladeProvider.svelte';
  import BottomSheet from '../../components/bottom-sheet/BottomSheet.svelte';
  import Modal from '../../components/modal/Modal.svelte';
  import ModalBody from '../../components/modal-children/ModalBody.svelte';
  import PhoneCountryList from '../../components/phone-number-input/PhoneCountryList.svelte';
  import type { PhoneCountry } from '../../runes/phone/parts';

  // The country list on an overlay's bare body: a modal or a sheet.
  let { layout }: { layout: 'modal' | 'sheet' } = $props();

  const countries: PhoneCountry[] = [
    { code: 'IN', name: 'India', dialCode: '+91' },
    { code: 'MY', name: 'Malaysia', dialCode: '+60' },
  ];
</script>

{#snippet list()}
  <ModalBody padding="spacing.0">
    <PhoneCountryList
      items={countries}
      label="Country"
      testID="countries"
      onPick={() => undefined}
    />
  </ModalBody>
{/snippet}

<BladeProvider testID="host">
  {#if layout === 'modal'}
    <Modal isOpen testID="overlay">{@render list()}</Modal>
  {:else}
    <BottomSheet isOpen testID="overlay">{@render list()}</BottomSheet>
  {/if}
</BladeProvider>
