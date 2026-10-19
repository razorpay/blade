import type { Component } from 'svelte';
import type { ProgressBarBehaviourProps, ProgressBarStyleProps } from './styles';

export * from './styles';
export { default as ProgressBar } from './ProgressBar.svelte';

export type ProgressBarComponent = Component<ProgressBarBehaviourProps & ProgressBarStyleProps>;
