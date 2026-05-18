import React from 'react';
import { Image, Pressable, Linking } from 'react-native';
import type { AvatarProps } from './types';
import {
  avatarSizeTokens,
  avatarBorderRadiusTokens,
  avatarToBottomAddonSize,
  avatarToIndicatorSize,
  avatarTopAddonOffsets,
  avatarIconSizeTokens,
  avatarTextSizeMapping,
} from './avatarTokens';
import { useAvatarGroupContext } from './AvatarGroupContext';
import { getStyledProps } from '~components/Box/styledProps';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { throwBladeError } from '~utils/logger';
import { UserIcon } from '~components/Icons';
import type { BladeElementRef } from '~utils/types';
import BaseBox from '~components/Box/BaseBox';
import { getComponentId } from '~utils/isValidAllowedChildren';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { useTheme } from '~components/BladeProvider';
import { Heading, Text } from '~components/Typography';
import { getTextColorToken } from '~components/Button/BaseButton/BaseButton';
import type { IconColor } from '~components/Button/BaseButton/types';
import type { BaseTextProps } from '~components/Typography/BaseText/types';
import { makeAccessible } from '~utils/makeAccessible';
import getIn from '~utils/lodashButBetter/get';

// Approximate native line-height for Indicator's internal Text.
// On native an empty <Text> reserves line-height even with no content, pushing
// the SVG dot down when it is vertically centred inside the flex row.
// Subtracting (lineHeight - svgSize) / 2 from the web top-offset compensates.
const INDICATOR_TEXT_LINE_HEIGHT = 20;

// Subtle-emphasis dot sizes (px) per indicator size — from indicatorDotSizes.
const indicatorSubtleSvgSize: Record<'small' | 'medium' | 'large', number> = {
  small: 6,
  medium: 8,
  large: 10,
};

function nativeTopOffset(webTop: string, indicatorSize: 'small' | 'medium' | 'large'): number {
  const px = parseInt(webTop, 10); // e.g. '2px' → 2
  const svgSize = indicatorSubtleSvgSize[indicatorSize];
  const centeringOffset = Math.max(0, (INDICATOR_TEXT_LINE_HEIGHT - svgSize) / 2);
  return px - centeringOffset;
}

const getInitials = (name: string): string => {
  const names = name.trim().toUpperCase().split(' ');
  if (names.length === 1) return names[0].substring(0, 2);
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
    isSelected,
    bottomAddon: BottomAddon,
    topAddon,
    src,
    alt,
    testID,
    onClick,
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
  const { theme } = useTheme();
  const avatarSize = groupProps?.size ?? size;
  const isInteractive = Boolean(onClick || href);
  const dimension = avatarSizeTokens[avatarSize];
  const borderRadius =
    theme.border.radius[
      variant === 'circle'
        ? avatarBorderRadiusTokens.circle
        : avatarBorderRadiusTokens.square[avatarSize]
    ];
  const bgColor = getIn(theme.colors, `interactive.background.${color}.faded`, '') as string;

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

  const [imgError, setImgError] = React.useState(false);
  const Icon = icon ?? UserIcon;
  const isSquare = variant === 'square';
  const hasAddons = Boolean(topAddon || BottomAddon);

  const renderContent = (): React.ReactElement => {
    if (src && !imgError) {
      return (
        <Image
          source={{ uri: src }}
          style={{ width: dimension, height: dimension, borderRadius }}
          resizeMode="cover"
          onError={() => setImgError(true)}
          accessibilityLabel={alt ?? name}
          accessibilityIgnoresInvertColors
        />
      );
    }

    if (name && (!src || imgError)) {
      return avatarSize === 'xlarge' ? (
        <Heading size={avatarTextSizeMapping[avatarSize]} weight="semibold" color={textColor}>
          {getInitials(name)}
        </Heading>
      ) : (
        <Text size={avatarTextSizeMapping[avatarSize]} weight="semibold" color={textColor}>
          {getInitials(name)}
        </Text>
      );
    }

    return <Icon size={avatarIconSizeTokens[avatarSize]} color={iconColor} />;
  };

  const handlePress = (): void => {
    if (href) void Linking.openURL(href);
    // onClick is typed for web (MouseEvent); on native we call it without an event arg
    onClick?.(undefined as never);
  };

  const indicatorSize = avatarToIndicatorSize[avatarSize];
  const topOffset = avatarTopAddonOffsets[variant][avatarSize];

  const avatarBody = (
    <BaseBox
      {...metaAttribute({ name: MetaConstants.Avatar, testID })}
      {...getStyledProps(rest)}
      {...makeAnalyticsAttribute(rest)}
      style={{
        width: dimension,
        height: dimension,
        borderRadius,
        borderWidth: isSelected ? theme.border.width.thicker : theme.border.width.thinner,
        borderColor: isSelected
          ? theme.colors.surface.border.primary.normal
          : theme.colors.surface.border.gray.subtle,
        backgroundColor: bgColor,
        overflow: 'hidden',
      }}
    >
      <BaseBox display="flex" alignItems="center" justifyContent="center" height="100%">
        {renderContent()}
      </BaseBox>
    </BaseBox>
  );

  // Addons are placed OUTSIDE the overflow:hidden avatar body so they are never
  // clipped — unlike the web where CSS overflow:hidden doesn't clip
  // absolutely-positioned children by default.
  const avatarWithAddons = hasAddons ? (
    <BaseBox style={{ width: dimension, height: dimension }}>
      {avatarBody}
      {topAddon ? (
        <BaseBox
          position="absolute"
          // Native fix: subtract the centering offset caused by the empty <Text>
          // inside Indicator that adds line-height even with no content.
          style={{
            top: nativeTopOffset(topOffset.top, indicatorSize),
            right: parseInt(topOffset.right, 10),
          }}
          zIndex={2}
        >
          {React.cloneElement(topAddon, { size: indicatorSize })}
        </BaseBox>
      ) : null}
      {BottomAddon ? (
        <BaseBox
          position="absolute"
          style={{
            bottom: isSquare ? Math.round(dimension * -0.1) : 0,
            right: isSquare ? Math.round(dimension * -0.1) : 0,
          }}
          zIndex={2}
        >
          <BottomAddon size={avatarToBottomAddonSize[avatarSize]} color={iconColor} />
        </BaseBox>
      ) : null}
    </BaseBox>
  ) : (
    avatarBody
  );

  if (isInteractive) {
    return (
      <Pressable
        ref={ref as never}
        onPress={handlePress}
        {...makeAccessible({ role: href ? 'link' : 'button' })}
      >
        {avatarWithAddons}
      </Pressable>
    );
  }

  return avatarWithAddons;
};

const Avatar = assignWithoutSideEffects(React.forwardRef(_Avatar), {
  displayName: 'Avatar',
  componentId: 'Avatar',
});

export { Avatar };
export type { AvatarProps };
