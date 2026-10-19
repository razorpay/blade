<script lang="ts">
  import BladeProvider from '../../components/blade-provider/BladeProvider.svelte';
  import { createToasts, type Toasts } from '../../components/toast/toasts';

  interface Props {
    onReady: (toasts: Toasts) => void;
    /** The queue to render. @default a new one */
    toasts?: Toasts;
  }

  let { onReady, toasts }: Props = $props();

  // Driven from outside: the test's own queue.
  // svelte-ignore state_referenced_locally
  const adapters = { toasts: toasts ?? createToasts() };
  // svelte-ignore state_referenced_locally
  onReady(adapters.toasts);
</script>

<BladeProvider {adapters} testID="host">
  <main data-testid="page">Checkout</main>
</BladeProvider>
