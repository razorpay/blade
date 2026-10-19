import type { Component } from 'svelte';
import type {
  AvatarBehaviourProps,
  AvatarGroupBehaviourProps,
  AvatarGroupStyleProps,
  AvatarStyleProps,
} from './styles';

export * from './styles';
export { default as Avatar } from './Avatar.svelte';
export { default as AvatarGroup } from './AvatarGroup.svelte';

export type AvatarComponent = Component<AvatarBehaviourProps & AvatarStyleProps>;
export type AvatarGroupComponent = Component<AvatarGroupBehaviourProps & AvatarGroupStyleProps>;
