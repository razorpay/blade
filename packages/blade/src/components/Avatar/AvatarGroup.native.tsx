import React from 'react';
import { View } from 'react-native';
import type { AvatarGroupProps } from './types';
import {
  avatarSizeTokens,
  avatarTextSizeMapping,
  avatarGroupDensityOverlapTokens,
} from './avatarTokens';
import { AvatarGroupProvider } from './AvatarGroupContext';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { useTheme } from '~components/BladeProvider';
import { Heading, Text } from '~components/Typography';

const _AvatarGroup = ({
  children,
  size = 'medium',
  density = 'compact',
  maxCount,
  testID,
}: AvatarGroupProps): React.ReactElement => {
  const { theme } = useTheme();
  const all = React.Children.toArray(children);
  const totalCount = all.length;
  const dimension = avatarSizeTokens[size];
  const overlap = avatarGroupDensityOverlapTokens[density][size];

  // 2px opaque ring — mirrors StyledAvatar's backgroundColor="surface.background.gray.intense".
  // Without it, semi-transparent faded avatar colours blend at the overlap (Venn-diagram effect).
  const RING = 2;
  const wrapperSize = dimension + RING * 2;
  const wrapperRadius = wrapperSize / 2;
  const ringColor = theme.colors.surface.background.gray.intense;

  // Adjusted so avatar bodies (not wrappers) overlap by exactly dimension / 2.
  // derivation: marginLeft = -(overlap + 2*RING) → body-to-body overlap = dimension/2.
  const itemMarginLeft = -(overlap + RING * 2);

  const visible = maxCount ? all.slice(0, maxCount) : all;
  const overflowCount = maxCount ? Math.max(0, totalCount - maxCount) : 0;

  return (
    <AvatarGroupProvider value={{ size }}>
      <View
        style={{ flexDirection: 'row', alignItems: 'center' }}
        {...metaAttribute({ name: MetaConstants.AvatarGroup, testID })}
      >
        {visible.map((child, i) => {
          const key = React.isValidElement(child) ? child.key ?? i : i;
          return (
            // Each wrapper is RING px larger on every side, filled with opaque intense-gray.
            // The avatar body sits inside the padding exposing the gray ring as a separator.
            // Ascending zIndex mirrors web's DOM-order stacking so each later avatar is on top.
            <View
              key={key}
              style={{
                padding: RING,
                width: wrapperSize,
                height: wrapperSize,
                borderRadius: wrapperRadius,
                backgroundColor: ringColor,
                marginLeft: i === 0 ? 0 : itemMarginLeft,
                zIndex: i + 1,
              }}
            >
              {child}
            </View>
          );
        })}

        {overflowCount > 0 ? (
          <View
            style={{
              padding: RING,
              width: wrapperSize,
              height: wrapperSize,
              borderRadius: wrapperRadius,
              backgroundColor: ringColor,
              marginLeft: itemMarginLeft,
              zIndex: visible.length + 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <View
              style={{
                width: dimension,
                height: dimension,
                borderRadius: dimension / 2,
                backgroundColor: theme.colors.surface.background.gray.subtle,
                borderWidth: 1,
                borderColor: theme.colors.surface.border.gray.subtle,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {size === 'xlarge' ? (
                <Heading size="small" weight="semibold" color="interactive.text.neutral.muted">
                  {`+${overflowCount}`}
                </Heading>
              ) : (
                <Text
                  size={avatarTextSizeMapping[size]}
                  weight="semibold"
                  color="interactive.text.neutral.muted"
                >
                  {`+${overflowCount}`}
                </Text>
              )}
            </View>
          </View>
        ) : null}
      </View>
    </AvatarGroupProvider>
  );
};

/**
 * ### AvatarGroup Component
 *
 * Groups multiple Avatar components with overlapping stacking and optional overflow count.
 *
 * ---
 *
 * #### Usage
 *
 * ```jsx
 * <AvatarGroup size="medium" maxCount={3}>
 *   <Avatar name="Nitin Kumar" color="primary" />
 *   <Avatar name="Priya Sharma" color="positive" />
 *   <Avatar name="Raj Patel" color="notice" />
 * </AvatarGroup>
 * ```
 *
 * Checkout {@link https://blade.razorpay.com/?path=/docs/components-avatar-avatargroup AvatarGroup Documentation}
 */
const AvatarGroup = assignWithoutSideEffects(_AvatarGroup, {
  displayName: 'AvatarGroup',
  componentId: 'AvatarGroup',
});

export { AvatarGroup };
