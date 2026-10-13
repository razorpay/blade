<script lang="ts" generics="T">
  import type { Snippet } from 'svelte';
  import { cx } from '../../cx';
  import { createAsync } from '../../runes/async/async.svelte';
  import Skeleton from '../skeleton/Skeleton.svelte';
  import { resolveAsync, type AsyncStyleProps } from './styles';

  type Props = AsyncStyleProps & {
    promise: Promise<T>;
    /** ms before the pending state shows; the styles' number when omitted. */
    pendingDelay?: number;
    /** Localized; announced while the promise is out. */
    pendingLabel?: string;
    onError?: (error: unknown) => void;
    /** The settled content; it receives `{ value }`. */
    children: Snippet<[{ value: T }]>;
    pending?: Snippet;
    /** Without it a failure renders nothing. It receives `{ error }`. */
    failed?: Snippet<[{ error: unknown }]>;
    testID?: string;
    class?: string;
  };

  let {
    promise,
    pendingDelay,
    pendingLabel,
    onError,
    children,
    pending,
    failed,
    testID,
    class: className = '',
    ...styleProps
  }: Props = $props();

  const classes = $derived(resolveAsync(styleProps));
  const async = createAsync<T>({
    promise: () => promise,
    pendingDelay: () => pendingDelay ?? classes.pendingDelay,
    onError: (error) => onError?.(error),
  });
  const outcome = $derived(async.outcome);
</script>

<!-- Text-shaped skeleton lines: the content is on its way. -->
{#snippet defaultPending()}
  {#each { length: styleProps.lines ?? 3 }, i}
    <Skeleton class={i === 0 ? 'h-5 w-2/3' : 'h-4 w-full'} />
  {/each}
{/snippet}

{#if outcome.status === 'done'}
  {@render children({ value: outcome.value })}
{:else if outcome.status === 'failed'}
  {@render failed?.({ error: outcome.error })}
{:else if async.isPendingShown}
  <div
    class={cx(classes.pending, className)}
    role="status"
    aria-busy="true"
    aria-label={pendingLabel}
    data-testid={testID}
  >
    {#if pending}
      {@render pending()}
    {:else}
      {@render defaultPending()}
    {/if}
  </div>
{/if}
