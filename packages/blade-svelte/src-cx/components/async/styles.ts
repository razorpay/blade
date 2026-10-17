import type { Snippet } from 'svelte';

/**
 * The parts of Async: how long a wait may go unmarked, and the box the
 * pending state sits in.
 */
export interface AsyncClasses {
  pending: string;
  /** ms before the pending state shows, so a fast load never flashes it. */
  pendingDelay: number;
}

export type AsyncStyleResolver<P> = (props: P) => AsyncClasses;

/** The shape of Async's default pending visual, kept for consumers of the type. */
export type AsyncPendingSnippet<P> = Snippet<[P]>;

/** No enumerable axes: `lines` is a count. */
export const ASYNC_AXES = {} as const;

export interface AsyncStyleProps {
  /** How many shimmer lines stand in for the content. */
  lines?: number;
}

// Ported from app/v2/lib/components/async/Async.svelte (delayPendingState).
export const resolveAsync: AsyncStyleResolver<AsyncStyleProps> = () => ({
  pending: 'flex w-full flex-col gap-3 py-2',
  pendingDelay: 150,
});
