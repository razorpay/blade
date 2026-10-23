<script lang="ts">
  import { CardGroup, CardGroupItem, TextInput } from '../../index';

  let option = $state<'full' | 'part' | null>('full');
  let partAmount = $state('');
</script>

<!-- A choice's body shows while it is picked: the part-payment field. -->
<div class="max-w-[400px]">
  <CardGroup bind:value={option} accessibilityLabel="Payment options">
    <CardGroupItem value="full" title="Pay in full" description="Pay ₹2,000 now" />
    <CardGroupItem value="part" title="Part payment" description="Pay a part of the total amount">
      {#snippet content()}
        <TextInput
          accessibilityLabel="Amount to pay"
          placeholder="Enter amount up to ₹2,000"
          bind:value={partAmount}
        />
      {/snippet}
    </CardGroupItem>
  </CardGroup>
</div>
