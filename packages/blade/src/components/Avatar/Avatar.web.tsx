import React from 'react';
import type { AvatarProps } from './types';
import { StyledAvatar } from './StyledAvatar';
import { DefaultAvatarIcon } from './DefaultAvatarIcon';

import { useAvatarGroupContext } from './AvatarGroupContext';
import { getStyledProps } from '~components/Box/styledProps';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { useDropdown } from '~components/Dropdown/useDropdown';
import BaseButton from '~components/Button/BaseButton/BaseButton';
import { throwBladeError } from '~utils/logger';
import { DropdownButton } from '~components/Dropdown';

const getInitials = (name: string): string => {
  // Combine first and last name initials
  const names = name.split(' ');
  if (names.length === 1) {
    return name.substring(0, 2);
  }
  return names[0].substring(0, 1) + names[names.length - 1].substring(0, 1);
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
}: AvatarProps): React.ReactElement => {
  if (src && !alt && !name) {
    throwBladeError({
      moduleName: 'Avatar',
      message: '"alt" or "name" prop is required when the "src" prop is provided.',
    });
  }
  const groupProps = useAvatarGroupContext();
  const avatarSize = groupProps?.size ?? size;

  const { dropdownTriggerer } = useDropdown();
  const isInsideDropdown = dropdownTriggerer === 'Avatar';
  const AvatarButton = isInsideDropdown ? DropdownButton : BaseButton;

  const getChildrenToRender = (): React.ReactElement => {
    if (src) {
      return (
        <AvatarButton
          variant="secondary"
          // @ts-expect-error -- Color prop mismatch, but works because DropdownButton is also BaseButton internally.
          color={color}
          size="xsmall"
          isPressAnimationDisabled={true}
          imgProps={{
            src,
            alt: alt ?? name,
            srcSet,
            crossOrigin,
            referrerPolicy,
          }}
          href={href}
          target={target}
          rel={rel}
        />
      );
    }

    if (name && !src) {
      return (
        <AvatarButton
          variant="secondary"
          // @ts-expect-error -- Color prop mismatch, but works because DropdownButton is also BaseButton internally.
          color={color}
          size="xsmall"
          iconSize={avatarSize}
          isPressAnimationDisabled={true}
          href={href}
          target={target}
          rel={rel}
        >
          {getInitials(name)}
        </AvatarButton>
      );
    }

    return (
      <AvatarButton
        variant="secondary"
        // @ts-expect-error -- Color prop mismatch, but works because DropdownButton is also BaseButton internally.
        color={color}
        size="xsmall"
        iconSize={avatarSize}
        icon={icon ?? DefaultAvatarIcon}
        isPressAnimationDisabled={true}
        href={href}
        target={target}
        rel={rel}
      />
    );
  };

  return (
    <StyledAvatar
      {...metaAttribute({ name: MetaConstants.Avatar, testID })}
      {...getStyledProps(styledProps)}
      backgroundColor="surface.background.gray.intense"
      variant={variant}
      color={color}
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
