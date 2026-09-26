import type { Component } from 'svelte';
import type { EmptyStateBehaviourProps, EmptyStateStyleProps } from './styles';

export * from './styles';
export { default as EmptyState } from './EmptyState.svelte';

export type EmptyStateComponent = Component<
  EmptyStateBehaviourProps & EmptyStateStyleProps
>;
