<script lang="ts">
  import { Badge } from '../../components/badge';
  import Card from '../../components/card/Card.svelte';
  import { Divider } from '../../components/divider';
  import { EmptyState } from '../../components/empty-state';
  import { FooterBar } from '../../components/footer-bar';
  import { Screen } from '../../components/screen';
  import { TrustBadge } from '../../components/trust-badge';
</script>

<Card testID="plain-card" class="mt-2">Plain</Card>
<Card variant="secondary" accessibilityLabel="Banks" testID="labelled-card">
  <Divider testID="rule" class="my-2" />
  <Divider orientation="vertical" line="dashed" testID="upright" />
</Card>

<Badge testID="tag" class="ml-1">New</Badge>
<Badge color="positive" emphasis="intense" size="small" testID="paid">
  Paid
</Badge>

<TrustBadge label="Razorpay Trusted Business" testID="trust" class="mt-1" />
<TrustBadge
  variant="icon-only"
  label="Razorpay Trusted Business"
  testID="trust-icon"
/>

<Screen isDisabled accessibilityLabel="Card" testID="screen" class="mt-3">
  Card form
  {#snippet footer()}
    <FooterBar testID="bar">
      {#snippet summary()}Total{/snippet}
      <button type="button">Pay</button>
    </FooterBar>
  {/snippet}
</Screen>

<EmptyState
  color="negative"
  title="Payment failed"
  message="Your money is safe"
  testID="empty"
  class="mt-4"
>
  {#snippet media()}<img src="/failed.svg" alt="" />{/snippet}
  <button type="button">Retry</button>
</EmptyState>
<EmptyState title="No saved cards" testID="empty-bare" />
