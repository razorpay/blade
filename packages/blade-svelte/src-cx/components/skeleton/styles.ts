// Ported from app/v2/components/Shimmer, pulsing as Blade's Skeleton does:
// the gray interactive fill brightening to its highlighted step. A skeleton
// has no box of its own: `cx` resolves no conflicts, so the caller's `class`
// is the only place its height, width and radius come from.
// Blade's Skeleton: the gray fill, no radius of its own (the caller's
// `class` gives the box its size and shape), fading in and then pulsing.
const SKELETON = 'block bg-interactive-gray-default animate-skeleton motion-reduce:animate-none';

export function resolveSkeleton(): string {
  return SKELETON;
}

/**
 * A placeholder where content is still loading: style-only. Always hidden
 * from assistive tech — the region that is loading announces it, not each
 * bone.
 */
export interface SkeletonBehaviourProps {
  testID?: string;
  /** Merged last; the skeleton's box lives here (`h-4 w-32`). */
  class?: string;
}
