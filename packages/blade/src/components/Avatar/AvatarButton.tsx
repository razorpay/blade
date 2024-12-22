import React from 'react';
import { StyledAvatarButton } from './StyledAvatarButton';
import type { AvatarButtonProps } from './types';
import { avatarTextSizeMapping, avatarIconSizeTokens } from './avatarTokens';
import BaseBox from '~components/Box/BaseBox';
import { makeAccessible } from '~utils/makeAccessible';
import { Heading, Text } from '~components/Typography';
import { getTextColorToken } from '~components/Button/BaseButton/BaseButton';
import type { IconColor } from '~components/Button/BaseButton/types';
import type { BaseTextProps } from '~components/Typography/BaseText/types';
import type { BladeElementRef } from '~utils/types';

const _AvatarButton: React.ForwardRefRenderFunction<BladeElementRef, AvatarButtonProps> = (
  {
    href,
    target,
    rel,
    variant = 'circle',
    color = 'neutral',
    size = 'medium',
    icon: Icon,
    imgProps,
    children,
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
    isSelected,
  },
  ref,
): React.ReactElement => {
  const isLink = Boolean(href);
  const isInteractive = Boolean(onClick || isLink);
  const as = isInteractive ? (href ? 'a' : 'button') : 'div';

  const defaultRel = target === '_blank' ? 'noreferrer noopener' : undefined;
  const iconColor = getTextColorToken({
    property: 'icon',
    variant: 'secondary',
    color,
    state: 'default',
  }) as IconColor;
  const textColor = getTextColorToken({
    property: 'text',
    variant: 'secondary',
    color,
    state: 'default',
  }) as BaseTextProps['color'];

  return (
    <StyledAvatarButton
      ref={ref as never}
      as={as as never}
      isInteractive={isInteractive}
      isSelected={isSelected}
      size={size}
      color={color}
      href={href}
      variant={variant}
      target={target}
      rel={rel ?? defaultRel}
      accessibilityProps={{
        ...makeAccessible({
          role: isInteractive ? (isLink ? 'link' : 'button') : 'presentation',
        }),
      }}
      onBlur={onBlur}
      onFocus={onFocus}
      onClick={onClick}
      onMouseLeave={onMouseLeave}
      onMouseMove={onMouseMove}
      onMouseDown={onMouseDown}
      onPointerDown={onPointerDown}
      onPointerEnter={onPointerEnter}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <BaseBox
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="center"
        zIndex={1}
        height="100%"
      >
        {Icon ? (
          <BaseBox display="flex" justifyContent="center" alignItems="center">
            <Icon size={avatarIconSizeTokens[size]} color={iconColor} />
          </BaseBox>
        ) : null}

        {/* eslint-disable-next-line jsx-a11y/alt-text -- alt text is provided in imgProps */}
        {imgProps?.src ? <img {...imgProps} /> : null}

        {size === 'xlarge' ? (
          <Heading size={avatarTextSizeMapping[size]} weight="semibold" color={textColor}>
            {children}
          </Heading>
        ) : (
          <Text size={avatarTextSizeMapping[size]} weight="semibold" color={textColor}>
            {children}
          </Text>
        )}
      </BaseBox>
    </StyledAvatarButton>
  );
};

const AvatarButton = React.forwardRef(_AvatarButton);

export { AvatarButton };
