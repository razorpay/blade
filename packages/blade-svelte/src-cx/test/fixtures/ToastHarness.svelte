<script lang="ts">
  import LayerHost from '../../components/layer/LayerHost.svelte';
  import { provideLayers } from '../../runes/layer/layers';
  import ToastStack from '../../components/toast/ToastStack.svelte';
  import { provideToasts, type Toasts } from '../../components/toast/toasts';

  interface Props {
    onReady: (toasts: Toasts) => void;
  }

  let { onReady }: Props = $props();

  provideLayers();
  const toasts = provideToasts();
  // svelte-ignore state_referenced_locally
  onReady(toasts);
</script>

<main data-testid="page">Checkout</main>
<ToastStack accessibilityLabel="Notifications" testID="toasts" />
<LayerHost testID="host" />
