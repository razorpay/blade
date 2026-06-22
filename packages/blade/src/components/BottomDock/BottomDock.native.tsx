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
      return {
        shadowColor:
          colorScheme === 'light'
            ? globalColors.neutral.blueGrayLight.a912
            : globalColors.neutral.black[100],
        shadowOffset: { width: 0, height: -8 },
        shadowRadius: 24,
        shadowOpacity: 1,
      };
    }

    return { elevation: 8 };
  }, [colorScheme]);

  return (
    <StyledBottomDock
      ref={ref as never}
      backgroundColor={theme.colors.surface.background.gray.intense}
      borderTopWidth={theme.border.width.thin}
      borderTopColor={theme.colors.surface.border.gray.muted}
      style={[shadowStyle, nativeStyle, { zIndex, paddingBottom: insets.bottom }]}
      {...makeAccessible({ role })}
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
