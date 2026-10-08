<script lang="ts">
  import { Button, BottomSheet, LayerHost, Text } from '../../index';

  let isOpen = $state(false);
  let step = $state<1 | 2>(1);
</script>

<!-- A two-step sheet: the back button returns to step 1; it is not a dismissal. -->
<div
  class="relative h-[32rem] max-w-96 overflow-hidden rounded-small border-thin border-solid border-surface-gray-muted"
>
  <div class="grid gap-4 p-6">
    <Button
      class="w-40"
      testID="open"
      onClick={() => {
        step = 1;
        isOpen = true;
      }}>Open sheet</Button
    >
  </div>
  <LayerHost />
</div>

<BottomSheet
  bind:isOpen
  title={step === 1 ? 'Choose a bank' : 'HDFC Bank'}
  showBackButton={step === 2}
  onBackButtonClick={() => (step = 1)}
  testID="sheet"
>
  {#snippet body()}
    {#if step === 1}
      <Button variant="secondary" class="w-full" testID="pick" onClick={() => (step = 2)}>
        HDFC Bank
      </Button>
    {:else}
      <Text size="small" color="muted">
        You will be redirected to HDFC Bank to complete the payment.
      </Text>
    {/if}
  {/snippet}
  {#snippet footer()}
    {#if step === 2}
      <Button class="w-full" onClick={() => (isOpen = false)}>Pay now</Button>
    {/if}
  {/snippet}
</BottomSheet>
