import type { Component } from 'svelte';
import type { FooterBarBehaviourProps, FooterBarStyleProps } from './styles';

export * from './styles';
export { default as FooterBar } from './FooterBar.svelte';

export type FooterBarComponent = Component<FooterBarBehaviourProps & FooterBarStyleProps>;
