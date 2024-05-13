import React from 'react';
import type { AvatarGroupProps, AvatarGroupContextType } from './types';
import { StyledAvatarGroup } from './StyledAvatarGroup';
import { StyledAvatar } from './StyledAvatar';
import { AvatarGroupProvider } from './AvatarGroupContext';
import { getStyledProps } from '~components/Box/styledProps';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { throwBladeError } from '~utils/logger';
import { isValidAllowedChildren } from '~utils/isValidAllowedChildren';
import BaseButton from '~components/Button/BaseButton/BaseButton';

const _AvatarGroup = ({
  children,
  size = 'xsmall',
  maxCount,
  testID,
  ...styledProps
}: AvatarGroupProps): React.ReactElement => {
  const contextValue: AvatarGroupContextType = {
    size,
  };

  return (
    <AvatarGroupProvider value={contextValue}>
      <StyledAvatarGroup
        {...metaAttribute({ name: MetaConstants.AvatarGroup, testID })}
        {...getStyledProps(styledProps)}
        role="group"
        size={size}
      >
        {React.Children.map(children, (child, index) => {
          if (__DEV__) {
            // throw error if child is not an Avatar
            if (!isValidAllowedChildren(child, 'Avatar')) {
              throwBladeError({
                moduleName: 'AvatarGroup',
                message: `Only "Avatar" component is allowed as a children.`,
              });
            }
          }

          if (maxCount && maxCount <= React.Children.count(children)) {
            if (index === maxCount) {
              return (
                <StyledAvatar
                  {...metaAttribute({ name: MetaConstants.Avatar, testID })}
                  backgroundColor="surface.background.gray.intense"
                  size={size}
                  color="neutral"
                  variant="circle"
                >
                  <BaseButton
                    variant="secondary"
                    color="neutral"
                    size="xsmall"
                    iconSize={size}
                    isPressAnimationDisabled={true}
                  >
                    {`+${String(React.Children.count(children) - maxCount)}`}
                  </BaseButton>
                </StyledAvatar>
              );
            }

            if (index > maxCount) {
              return null;
            }
          }

          return child;
        })}
      </StyledAvatarGroup>
    </AvatarGroupProvider>
  );
};

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
const AvatarGroup = assignWithoutSideEffects(_AvatarGroup, {
  displayName: 'AvatarGroup',
  componentId: 'AvatarGroup',
});

export { AvatarGroup };
export type { AvatarGroupProps };
