import type { Component } from 'svelte';
import type { ScreenBehaviourProps, ScreenStyleProps } from './styles';

export * from './styles';
export { default as Screen } from './Screen.svelte';

export type ScreenComponent = Component<
  ScreenBehaviourProps & ScreenStyleProps
>;
