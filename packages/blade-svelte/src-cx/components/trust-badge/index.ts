import type { Component } from 'svelte';
import type { TrustBadgeBehaviourProps, TrustBadgeStyleProps } from './styles';

export * from './styles';
export { default as TrustBadge } from './TrustBadge.svelte';

export type TrustBadgeComponent = Component<
  TrustBadgeBehaviourProps & TrustBadgeStyleProps
>;
