<script lang="ts">
  import Async from '../../components/async/Async.svelte';
  import { provideAdapters } from '../../adapters';

  interface Props {
    promise: Promise<string>;
    pendingDelay?: number;
    withPending?: boolean;
    withFailed?: boolean;
    onError?: (error: unknown) => void;
    captureError?: (error: unknown) => void;
  }

  let {
    promise,
    pendingDelay,
    withPending = false,
    withFailed = true,
    onError,
    captureError,
  }: Props = $props();

  // svelte-ignore state_referenced_locally
  provideAdapters({ captureError });
</script>

{#snippet ownPending()}<span data-testid="own">Wait</span>{/snippet}
{#snippet ownFailed(error: unknown)}
  <p data-testid="failed">{(error as Error).message}</p>
{/snippet}

<Async
  {promise}
  {pendingDelay}
  pendingLabel="Loading"
  {onError}
  pending={withPending ? ownPending : undefined}
  failed={withFailed ? ownFailed : undefined}
  testID="wait"
>
  {#snippet children(value)}
    <p data-testid="value">{value}</p>
  {/snippet}
</Async>
