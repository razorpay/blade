<script lang="ts">
  import Alert from '../../components/alert/Alert.svelte';
  import { AlertTriangleIcon } from '../../icons';

  interface Props {
    isOpen?: boolean;
    isDismissible?: boolean;
    closeLabel?: string;
    onDismiss?: () => void;
  }

  let {
    isOpen = $bindable(true),
    isDismissible,
    closeLabel,
    onDismiss,
  }: Props = $props();
</script>

<Alert
  bind:isOpen
  {isDismissible}
  {closeLabel}
  {onDismiss}
  title="Payment failed"
  description="Try another method"
  icon={AlertTriangleIcon}
  testID="problem"
  class="mt-2"
/>
<p data-testid="open">{isOpen ? 'open' : 'closed'}</p>
