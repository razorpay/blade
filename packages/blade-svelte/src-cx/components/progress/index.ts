import type { Component } from 'svelte';
import type { ProgressBehaviourProps, ProgressStyleProps } from './styles';

export * from './styles';
export { default as Progress } from './Progress.svelte';

export type ProgressComponent = Component<ProgressBehaviourProps & ProgressStyleProps>;
