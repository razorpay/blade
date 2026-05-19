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
import { getInitials } from './avatarUtils';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { throwBladeError } from '~utils/logger';
import type { BladeElementRef } from '~utils/types';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { makeAccessible } from '~utils/makeAccessible';
import getIn from '~utils/lodashButBetter/get';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { getComponentId } from '~utils/isValidAllowedChildren';
import { UserIcon } from '~components/Icons';
import { useTheme } from '~components/BladeProvider';
import { getStyledProps } from '~components/Box/styledProps';
import BaseBox from '~components/Box/BaseBox';
import { Heading, Text } from '~components/Typography';
import { getTextColorToken } from '~components/Button/BaseButton/BaseButton';
import type { IconColor } from '~components/Button/BaseButton/types';
import type { BaseTextProps } from '~components/Typography/BaseText/types';

// Approximate native line-height for Indicator's internal Text.
// On native an empty <Text> reserves line-height even with no content, pushing
// the SVG dot down when it is vertically centred inside the flex row.
// Subtracting (lineHeight - svgSize) / 2 from the web top-offset compensates.
// Value sourced from Indicator component's internal text line-height on native.
const INDICATOR_TEXT_LINE_HEIGHT = 20;

// Subtle-emphasis dot sizes (px) per indicator size.
// Sourced from indicatorDotSizes in indicatorTokens — keep in sync if those change.
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
    // onClick is web-only (MouseEvent); on native the Pressable's onPress already handles
    // the interaction — do not call onClick to avoid passing undefined as a MouseEvent.
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
