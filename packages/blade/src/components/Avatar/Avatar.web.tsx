import React from 'react';
import type { AvatarProps } from './types';
import { StyledAvatar } from './StyledAvatar';
import { useAvatarGroupContext } from './AvatarGroupContext';
import { AvatarButton } from './AvatarButton';
import {
  avatarToBottomAddonSize,
  avatarToIndicatorSize,
  avatarTopAddonOffsets,
} from './avatarTokens';
import { getStyledProps } from '~components/Box/styledProps';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { throwBladeError } from '~utils/logger';
import { UserIcon } from '~components/Icons';
import type { BladeElementRef } from '~utils/types';
import BaseBox from '~components/Box/BaseBox';
import { getComponentId } from '~utils/isValidAllowedChildren';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';

const getInitials = (name: string): string => {
  // Combine first and last name initials
  const names = name.trim().toUpperCase().split(' ');

  if (names.length === 1) {
    return names[0].substring(0, 2);
  }
  return names[0][0] + names[names.length - 1][0];
};

const _Avatar: React.ForwardRefRenderFunction<BladeElementRef, AvatarProps> = (
  {
    name,
    color = 'neutral',
    size = 'medium',
    variant = 'circle',
    icon,
    href,
    target,
    rel,
    isSelected,
    bottomAddon: BottomAddon,
    topAddon,
    // Image Props
    src,
    alt,
    srcSet,
    crossOrigin,
    referrerPolicy,
    testID,
    // interaction props
    onBlur,
    onFocus,
    onClick,
    onMouseLeave,
    onMouseMove,
    onMouseDown,
    onPointerDown,
    onPointerEnter,
    onTouchStart,
    onTouchEnd,
    ...rest
  },
  ref,
) => {
  if (__DEV__) {
    if (src && !alt && !name) {
      throwBladeError({
        moduleName: 'Avatar',
        message: '"alt" or "name" prop is required when the "src" prop is provided.',
      });
    }
    if (topAddon && getComponentId(topAddon) !== 'Indicator') {
      throwBladeError({
        moduleName: 'Avatar',
        message: 'TopAddon only accepts `Indicator` component.',
      });
    }
  }

  const groupProps = useAvatarGroupContext();
  const avatarSize = groupProps?.size ?? size;
  const isInteractive = Boolean(onClick || href);

  const commonButtonProps = {
    variant,
    color,
    size: avatarSize,
    href,
    target,
    rel,
    onBlur,
    onFocus,
    isSelected,
    onClick,
    onMouseLeave,
    onMouseMove,
    onMouseDown,
    onPointerDown,
    onPointerEnter,
    onTouchStart,
    onTouchEnd,
  };

  const getChildrenToRender = (): React.ReactElement => {
    if (src) {
      return (
        <AvatarButton
          {...commonButtonProps}
          ref={ref as never}
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
      return (
        <AvatarButton ref={ref as never} {...commonButtonProps}>
          {getInitials(name)}
        </AvatarButton>
      );
    }

    return <AvatarButton {...commonButtonProps} icon={icon ?? UserIcon} />;
  };

  const isSquare = variant === 'square';
  return (
    <StyledAvatar
      {...metaAttribute({ name: MetaConstants.Avatar, testID })}
      {...getStyledProps(rest)}
      {...makeAnalyticsAttribute(rest)}
      backgroundColor="surface.background.gray.intense"
      variant={variant}
      size={avatarSize}
      isInteractive={isInteractive}
    >
      <BaseBox width="100%" height="100%" position="relative">
        {topAddon ? (
          <BaseBox
            position="absolute"
            top={avatarTopAddonOffsets[variant][size].top}
            right={avatarTopAddonOffsets[variant][size].right}
          >
            {React.cloneElement(topAddon, { size: avatarToIndicatorSize[size], display: 'block' })}
          </BaseBox>
        ) : null}
        {getChildrenToRender()}
        {BottomAddon ? (
          <BaseBox
            position="absolute"
            bottom={isSquare ? '-10%' : '0%'}
            right={isSquare ? '-10%' : '0%'}
          >
            <BottomAddon display="block" size={avatarToBottomAddonSize[size]} />
          </BaseBox>
        ) : null}
      </BaseBox>
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
const Avatar = assignWithoutSideEffects(React.forwardRef(_Avatar), {
  displayName: 'Avatar',
  componentId: 'Avatar',
});

export { Avatar };
export type { AvatarProps };
