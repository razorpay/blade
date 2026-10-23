<script lang="ts">
  import Card from '../../components/card/Card.svelte';
  import { Divider } from '../../components/divider';
  import { EmptyState } from '../../components/empty-state';
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
