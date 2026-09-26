<script lang="ts">
  import Alert from '../../components/alert/Alert.svelte';
  import { warning } from '../../components/icons';

  interface Props {
    isOpen?: boolean;
    closeLabel?: string;
    withActions?: boolean;
    onDismiss?: () => void;
  }

  let { isOpen, closeLabel, withActions = false, onDismiss }: Props = $props();
</script>

{#snippet retry()}<button type="button">Retry</button>{/snippet}

<Alert
  {isOpen}
  {closeLabel}
  {onDismiss}
  title="Payment failed"
  icon={warning}
  actions={withActions ? retry : undefined}
  testID="problem"
  class="mt-2"
>
  Try another method
</Alert>
