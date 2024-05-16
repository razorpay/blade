import type { ReactElement } from 'react';
import React from 'react';
import type { AvatarProps } from './types';
import { StyledAvatar } from './StyledAvatar';
import { useAvatarGroupContext } from './AvatarGroupContext';
import { AvatarButton } from './AvatarButton';
import { getStyledProps } from '~components/Box/styledProps';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { throwBladeError } from '~utils/logger';
import { UserIcon } from '~components/Icons';

const getInitials = (name: string): string => {
  // Combine first and last name initials
  const names = name.trim().toUpperCase().split(' ');

  if (names.length === 1) {
    return names[0].substring(0, 2);
  }
  return names[0][0] + names[names.length - 1][0];
};

const _Avatar = ({
  name,
  color = 'neutral',
  size = 'xsmall',
  variant = 'circle',
  icon,
  href,
  target,
  rel,
  // Image Props
  src,
  alt,
  srcSet,
  crossOrigin,
  referrerPolicy,
  testID,
  ...styledProps
}: AvatarProps): ReactElement => {
  if (__DEV__) {
    if (src && !alt && !name) {
      throwBladeError({
        moduleName: 'Avatar',
        message: '"alt" or "name" prop is required when the "src" prop is provided.',
      });
    }
  }

  const groupProps = useAvatarGroupContext();
  const avatarSize = groupProps?.size ?? size;

  const commonButtonProps = {
    variant,
    color,
    size: avatarSize,
    href,
    target,
    rel,
  };

  const getChildrenToRender = (): React.ReactElement => {
    if (src) {
      return (
        <AvatarButton
          {...commonButtonProps}
          imgProps={{
            src,
            alt: alt ?? name,
            srcSet,
            crossOrigin,
            referrerPolicy,
          }}
        />
      );
    }

    if (name && !src) {
      return <AvatarButton {...commonButtonProps}>{getInitials(name)}</AvatarButton>;
    }

    return <AvatarButton {...commonButtonProps} icon={icon ?? UserIcon} />;
  };

  return (
    <StyledAvatar
      {...metaAttribute({ name: MetaConstants.Avatar, testID })}
      {...getStyledProps(styledProps)}
      backgroundColor="surface.background.gray.intense"
      variant={variant}
      size={avatarSize}
    >
      {getChildrenToRender()}
    </StyledAvatar>
  );
};

/**
 * ### Avatar Component
 * 
 * An avatar component is a standardized visual representation of a user or entity.
 * 
 * ---
 * 
 * #### Usage
 * 
 * ```jsx
  <Avatar name="Nitin Kumar" src="https://avatars.githubusercontent.com/u/46647141?v=4" /> 
 * ```
 *
 *  ---
 *
 * Checkout {@link https://blade.razorpay.com/?path=/docs/components-avatar-avatar Avatar Documentation}
 * 
 */
const Avatar = assignWithoutSideEffects(_Avatar, {
  displayName: 'Avatar',
  componentId: 'Avatar',
});

export { Avatar };
export type { AvatarProps };
