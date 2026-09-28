<script lang="ts">
  import {
    Button,
    bottomSheetLook,
    openModal,
    Text,
    type ModalControl,
  } from '../../index';
  import ImperativeConfirm from './ImperativeConfirm.svelte';

  interface Props {
    bank: string;
    depth?: number;
    modal: ModalControl<boolean>;
  }

  let { bank, depth = 1, modal }: Props = $props();

  function openAnother() {
    openModal(ImperativeConfirm, {
      props: { bank, depth: depth + 1 },
      title: `Modal ${depth + 1}`,
      closeLabel: 'Close',
      look: bottomSheetLook,
    });
  }
</script>

<div class="flex flex-col gap-3">
  <Text color="subtle">
    You will be redirected to {bank} to finish the payment.
  </Text>
  <Button class="w-full" type="button" onClick={() => modal.close(true)}>
    Continue
  </Button>
  <Button variant="tertiary" type="button" onClick={openAnother}>
    Open another on top
  </Button>
</div>
