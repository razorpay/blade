import { default as React } from 'react';
import { AvatarGroupProps } from './types';
/**
 * ### AvatarGroup Component
 *
 * The AvatarGroup component is used to group Avatars together.
 *
 * ---
 *
 * #### Usage
 *
 * ```jsx
  const App = () => {
    return (
      <AvatarGroup>
        <Avatar name="Kamlesh Chandnani" />
        <Avatar name="Rama Krushna Behera" />
        <Avatar name="Chaitanya Vikas Deorukhkar" />
        <Avatar name="Anurag Hazra" />
        <Avatar name="Nitin Kumar" />
      </AvatarGroup>
    );
  }
 * ```
 *
 *  ---
 *
 * Checkout {@link https://blade.razorpay.com/?path=/docs/components-avatar-avatargroup AvatarGroup Documentation}
 *
 */
declare const AvatarGroup: ({ children, size, maxCount, testID, ...rest }: AvatarGroupProps) => React.ReactElement;
export { AvatarGroup };
export type { AvatarGroupProps };
