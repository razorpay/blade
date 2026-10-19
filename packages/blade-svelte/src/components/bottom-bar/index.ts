import type { Component } from 'svelte';
import type { BottomBarBehaviourProps } from './styles';

export * from './styles';
export { default as BottomBar } from './BottomBar.svelte';

export type BottomBarComponent = Component<BottomBarBehaviourProps>;
