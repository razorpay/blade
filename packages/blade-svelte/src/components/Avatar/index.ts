/**
 * Avatar component - A standardized visual representation of a user or entity.
 *
 * @example
 * ```svelte
 * <script>
 *   import { Avatar, AvatarGroup } from '@razorpay/blade-svelte/components';
 * </script>
 *
 * <Avatar name="Nitin Kumar" src="https://avatars.githubusercontent.com/u/46647141?v=4" />
 *
 * <AvatarGroup>
 *   <Avatar name="Kamlesh Chandnani" color="primary" />
 *   <Avatar name="Rama Krushna Behera" color="positive" />
 * </AvatarGroup>
 * ```
 */
export { default as Avatar } from './Avatar.svelte';
export { default as AvatarGroup } from './AvatarGroup.svelte';
export type {
  AvatarProps,
  AvatarGroupProps,
  AvatarSize,
  AvatarVariant,
  AvatarColor,
} from './types';
