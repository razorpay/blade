import React from 'react';
import { Platform, View } from 'react-native';
import type { ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import type { BottomDockProps } from './types';
import { useTheme } from '~components/BladeProvider';
import { colors as globalColors } from '~tokens/global';
import { componentZIndices } from '~utils/componentZIndices';
import { makeAccessible } from '~utils/makeAccessible';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { metaAttribute } from '~utils/metaAttribute';
import type { BladeElementRef } from '~utils/types';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const BOTTOM_DOCK_SHADOW_Y_OFFSET = -8;
const BOTTOM_DOCK_SHADOW_BLUR_RADIUS = 24;
const BOTTOM_DOCK_SHADOW_OPACITY = 1;
const BOTTOM_DOCK_ANDROID_ELEVATION = 8;

const StyledBottomDock = styled(View)<{
  backgroundColor: string;
  borderTopWidth: number;
  borderTopColor: string;
}>((props) => ({
  position: 'absolute' as const,
  bottom: 0,
  left: 0,
  width: '100%',
  backgroundColor: props.backgroundColor,
  borderTopWidth: props.borderTopWidth,
  borderTopColor: props.borderTopColor,
}));

const _BottomDock = (
  {
    children,
    zIndex = componentZIndices.bottomNav,
    role,
    accessibilityLabel,
    testID,
    metaName,
    nativeStyle,
    ...rest
  }: BottomDockProps,
  ref: React.Ref<BladeElementRef>,
): React.ReactElement => {
  const { theme, colorScheme } = useTheme();
  const insets = useSafeAreaInsets();

  const shadowStyle = React.useMemo<ViewStyle>(() => {
    if (Platform.OS === 'ios') {
      // Figma _components/Bottom Nav: 0px -8px 24px 0px _styles.bottomNav.color.
      return {
        shadowColor:
          colorScheme === 'light'
            ? globalColors.neutral.blueGrayLight.a912
            : globalColors.neutral.black[100],
        shadowOffset: { width: 0, height: BOTTOM_DOCK_SHADOW_Y_OFFSET },
        shadowRadius: BOTTOM_DOCK_SHADOW_BLUR_RADIUS,
        shadowOpacity: BOTTOM_DOCK_SHADOW_OPACITY,
      };
    }

    return { elevation: BOTTOM_DOCK_ANDROID_ELEVATION };
  }, [colorScheme]);

  return (
    <StyledBottomDock
      ref={ref as never}
      backgroundColor={theme.colors.surface.background.gray.intense}
      borderTopWidth={theme.border.width.thin}
      borderTopColor={theme.colors.surface.border.gray.muted}
      style={[shadowStyle, nativeStyle, { zIndex, paddingBottom: insets.bottom }]}
      {...makeAccessible({ role, label: accessibilityLabel })}
      {...metaAttribute({
        testID,
        name: metaName,
      })}
      {...makeAnalyticsAttribute(rest)}
    >
      {children}
    </StyledBottomDock>
  );
};

const BottomDock = assignWithoutSideEffects(React.forwardRef(_BottomDock), {
  displayName: 'BottomDock',
});

export { BottomDock };
