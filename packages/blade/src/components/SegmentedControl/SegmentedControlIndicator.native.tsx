import React from 'react';
import { StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { indicatorBorderRadius } from './segmentedControlTokens';
import { useTheme } from '~components/BladeProvider';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';

type SegmentedControlIndicatorProps = {
  itemWidths: number[];
  selectedIndex: number;
};

const styles = StyleSheet.create({
  indicator: {
    position: 'absolute',
  },
});

const SegmentedControlIndicator = ({
  itemWidths,
  selectedIndex,
}: SegmentedControlIndicatorProps): React.ReactElement | null => {
  const { theme } = useTheme();

  const targetLeft = itemWidths.slice(0, selectedIndex).reduce((sum, w) => sum + w, 0);
  const targetWidth = itemWidths[selectedIndex] ?? 0;

  const animLeft = useSharedValue(targetLeft);
  const animWidth = useSharedValue(targetWidth);

  React.useEffect(() => {
    animLeft.value = withTiming(targetLeft, { duration: 200 });
    animWidth.value = withTiming(targetWidth, { duration: 200 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetLeft, targetWidth]);

  const animStyle = useAnimatedStyle(() => ({
    left: animLeft.value,
    width: animWidth.value,
  }));

  if (itemWidths.length === 0 || targetWidth === 0) return null;

  return (
    <Animated.View
      {...metaAttribute({ name: MetaConstants.SegmentedControlIndicator })}
      style={[
        styles.indicator,
        {
          top: theme.spacing[2],
          bottom: theme.spacing[2],
          backgroundColor: theme.colors.surface.background.gray.intense,
          borderRadius: theme.border.radius[indicatorBorderRadius],
        },
        animStyle,
      ]}
    />
  );
};

export { SegmentedControlIndicator };
