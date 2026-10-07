<script lang="ts">
  import Card from '../../components/card/Card.svelte';
  import { Divider } from '../../components/divider';
  import { EmptyState } from '../../components/empty-state';
  import { Screen } from '../../components/screen';
  import { TrustBadge } from '../../components/trust-badge';
</script>

<Card testID="plain-card" class="mt-2">Plain</Card>
<Card variant="secondary" accessibilityLabel="Banks" testID="labelled-card">
  <Divider testID="rule" class="my-2" />
  <Divider orientation="vertical" dividerStyle="dashed" testID="upright" />
</Card>

<TrustBadge label="Razorpay Trusted Business" testID="trust" class="mt-1" />
<TrustBadge
  variant="icon-only"
  label="Razorpay Trusted Business"
  testID="trust-icon"
/>

<Screen isDisabled accessibilityLabel="Card" testID="screen" class="mt-3">
  Card form
  {#snippet footer()}
    <div data-testid="bar"><button type="button">Pay</button></div>
  {/snippet}
</Screen>

<EmptyState
  title="Payment failed"
  description="Your money is safe"
  testID="empty"
  class="mt-4"
>
  {#snippet asset()}<img src="/failed.svg" alt="" />{/snippet}
  <button type="button">Retry</button>
</EmptyState>
<EmptyState title="No saved cards" testID="empty-bare" />
