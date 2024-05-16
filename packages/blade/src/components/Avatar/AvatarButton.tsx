import React from 'react';
import { StyledAvatarButton } from './StyledAvatarButton';
import type { AvatarButtonProps } from './types';
import { avatarTextSizeMapping } from './avatarTokens';
import BaseBox from '~components/Box/BaseBox';
import { makeAccessible } from '~utils/makeAccessible';
import { Heading, Text } from '~components/Typography';
import { getTextColorToken } from '~components/Button/BaseButton/BaseButton';
import type { IconColor } from '~components/Button/BaseButton/types';
import type { BaseTextProps } from '~components/Typography/BaseText/types';

const getRenderElement = (href?: string): 'a' | 'button' => {
  if (href) {
    return 'a';
  }

  return 'button';
};

const AvatarButton = ({
  href,
  target,
  rel,
  variant = 'circle',
  color = 'neutral',
  size = 'xsmall',
  icon: Icon,
  imgProps,
  children,
}: AvatarButtonProps): React.ReactElement => {
  const isLink = Boolean(href);
  const renderElement = React.useMemo(() => getRenderElement(href), [href]);
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
      as={renderElement}
      size={size}
      color={color}
      href={href}
      variant={variant}
      target={target}
      rel={rel ?? defaultRel}
      accessibilityProps={{
        ...makeAccessible({
          role: isLink ? 'link' : 'button',
        }),
      }}
    >
      <BaseBox
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="center"
        justifyItems="center"
        zIndex={1}
        height="100%"
      >
        {Icon ? (
          <BaseBox display="flex" justifyContent="center" alignItems="center">
            <Icon size={size} color={iconColor} />
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

export { AvatarButton };
