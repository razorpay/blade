<script lang="ts">
  import Alert from '../../components/alert/Alert.svelte';
  import EmptyState from '../../components/empty-state/EmptyState.svelte';
</script>

<Alert testID="alert">
  {#snippet title()}Payment <em data-testid="alert-title">failed</em>{/snippet}
  {#snippet description()}Try <a href="#upi">UPI</a>{/snippet}
</Alert>

<EmptyState testID="empty">
  {#snippet title()}No <em data-testid="empty-title">saved</em> cards{/snippet}
  {#snippet description()}Add one at <a href="#pay" data-testid="empty-link">checkout</a>{/snippet}
</EmptyState>
