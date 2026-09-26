import type { Component } from 'svelte';
import type { BadgeBehaviourProps, BadgeStyleProps } from './styles';

export * from './styles';
export { default as Badge } from './Badge.svelte';

export type BadgeComponent = Component<BadgeBehaviourProps & BadgeStyleProps>;
