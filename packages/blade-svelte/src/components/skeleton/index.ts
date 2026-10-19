import type { Component } from 'svelte';
import type { SkeletonBehaviourProps } from './styles';

export * from './styles';
export { default as Skeleton } from './Skeleton.svelte';

export type SkeletonComponent = Component<SkeletonBehaviourProps>;
