import { setContext, getContext } from 'svelte';
import type { AvatarGroupContextType } from './types';

const AVATAR_GROUP_KEY = Symbol('AvatarGroupContext');

/**
 * Set the AvatarGroup context. Uses getter pattern for reactivity.
 * Call this from AvatarGroup to propagate size to child Avatars.
 */
export function setAvatarGroupContext(getter: () => AvatarGroupContextType): void {
  setContext(AVATAR_GROUP_KEY, getter);
}

/**
 * Get the AvatarGroup context. Returns undefined if not inside an AvatarGroup.
 * Uses getter pattern — call the returned function to get current reactive values.
 */
export function getAvatarGroupContext(): AvatarGroupContextType | undefined {
  const getter = getContext<(() => AvatarGroupContextType) | undefined>(AVATAR_GROUP_KEY);
  return getter?.();
}
