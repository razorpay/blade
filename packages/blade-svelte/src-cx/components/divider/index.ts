import type { Component } from 'svelte';
import type { DividerBehaviourProps, DividerStyleProps } from './styles';

export * from './styles';
export { default as Divider } from './Divider.svelte';

export type DividerComponent = Component<
  DividerBehaviourProps & DividerStyleProps
>;
