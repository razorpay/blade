import type { Component } from 'svelte';
import type { DotLoaderBehaviourProps, DotLoaderStyleProps } from './styles';

export * from './styles';
export { default as DotLoader } from './DotLoader.svelte';

export type DotLoaderComponent = Component<DotLoaderBehaviourProps & DotLoaderStyleProps>;
