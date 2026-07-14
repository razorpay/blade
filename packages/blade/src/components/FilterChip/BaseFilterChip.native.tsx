import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import type { LayoutChangeEvent, GestureResponderEvent } from 'react-native';
import styled from 'styled-components/native';
import Svg, { Rect } from 'react-native-svg';
import type { BaseFilterChipProps } from './types';
import { size } from '~tokens/global';
import { makeBorderSize } from '~utils';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { makeAccessible } from '~utils/makeAccessible';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { Box } from '~components/Box';
import { Counter } from '~components/Counter';
import { Divider } from '~components/Divider';
import { ChevronDownIcon, CloseIcon } from '~components/Icons';
import { Text } from '~components/Typography';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { useTheme } from '~components/BladeProvider';
import type { Theme } from '~components/BladeProvider';

const FILTER_CHIP_HEIGHT_NATIVE = size['28'];

/**
 * React Native's `borderStyle: 'dashed'` combined with `borderRadius` is buggy on iOS —
 * dashes render inconsistently and produce a broken/overlapping artifact near the corners
 * and the right edge. To match web's clean dashed pill, we draw the dashed border ourselves
 * with `react-native-svg` as a rounded `Rect` whose dash pattern divides evenly around the
 * perimeter (so there's no visible seam where the stroke path closes).
 */
const DashedBorder = ({
  width,
  height,
  borderRadius,
  strokeWidth,
  color,
}: {
  width: number;
  height: number;
  borderRadius: number;
  strokeWidth: number;
  color: string;
}): React.ReactElement | null => {
  if (width <= 0 || height <= 0) {
    return null;
  }

  // Inset the stroke by half its width so it sits fully inside the bounds and the
  // right/bottom edges aren't clipped.
  const inset = strokeWidth / 2;
  const rectWidth = width - strokeWidth;
  const rectHeight = height - strokeWidth;
  const radius = Math.max(borderRadius - inset, 0);

  // Perimeter of a rounded rectangle = straight edges + the four quarter-circle corners.
  const straightWidth = Math.max(rectWidth - 2 * radius, 0);
  const straightHeight = Math.max(rectHeight - 2 * radius, 0);
  const perimeter = 2 * straightWidth + 2 * straightHeight + 2 * Math.PI * radius;

  // Target a small dot-like dash+gap (~4pt) and round to an integer number of segments so
  // the pattern lands exactly on the path's start/end point (no broken dash on the right edge).
  const targetSegment = 4;
  const segmentCount = Math.max(1, Math.round(perimeter / targetSegment));
  const segmentLength = perimeter / segmentCount;
  const dashLength = segmentLength / 2;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg width={width} height={height}>
        <Rect
          x={inset}
          y={inset}
          width={rectWidth}
          height={rectHeight}
          rx={radius}
          ry={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={[dashLength, segmentLength - dashLength]}
        />
      </Svg>
    </View>
  );
};

const StyledFilterChip = styled(View)<{
  theme: Theme;
  $isSelected?: boolean;
  $isDisabled?: boolean;
}>(({ theme, $isDisabled, $isSelected }) => {
  return {
    // When unselected the dashed border is drawn via an SVG overlay (see DashedBorder) so we
    // rely on it entirely: the native border has zero width, keeping the overlay's coordinate
    // space aligned with the border-box and avoiding iOS's buggy dashed+radius render.
    borderWidth: $isSelected ? makeBorderSize(theme.border.width.thin) : 0,
    borderColor: $isSelected
      ? theme.colors.interactive.border.gray[$isDisabled ? 'disabled' : 'faded']
      : 'transparent',
    height: FILTER_CHIP_HEIGHT_NATIVE,
    borderRadius: theme.border.radius.small,
    borderStyle: 'solid',
    backgroundColor: theme.colors.surface.background.gray.intense,
    flexDirection: 'row',
    alignSelf: 'flex-start',
    // The SVG dashed border must not be clipped when unselected; the selected state clips its
    // divider/close button to the rounded corners.
    overflow: $isSelected ? 'hidden' : 'visible',
  };
});

const StyledFilterTrigger = styled(Pressable)<{
  theme: Theme;
  $hasClearButton?: boolean;
}>(({ theme, $hasClearButton }) => {
  const { spacing } = theme;
  return {
    backgroundColor: 'transparent',
    // When a clear button follows the trigger its right corners butt against the divider,
    // so they're squared off. Without a clear button the trigger is a self-contained pill.
    borderRadius: $hasClearButton ? 0 : theme.border.radius.small,
    borderTopLeftRadius: theme.border.radius.small,
    borderBottomLeftRadius: theme.border.radius.small,
    paddingLeft: spacing[4],
    paddingRight: $hasClearButton ? spacing[2] : spacing[3],
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
    gap: spacing[2],
  };
});

const StyledFilterCloseButton = styled(Pressable)<{ theme: Theme }>(({ theme }) => {
  return {
    backgroundColor: 'transparent',
    borderTopRightRadius: theme.border.radius.small,
    borderBottomRightRadius: theme.border.radius.small,
    paddingLeft: theme.spacing[2] + theme.spacing[1],
    paddingRight: theme.spacing[2] + theme.spacing[1],
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  };
});

const renderValue = (
  selectionType: BaseFilterChipProps['selectionType'],
  value: BaseFilterChipProps['value'],
  isDisabled?: boolean,
): React.ReactElement => {
  const valueColor = isDisabled
    ? 'interactive.text.gray.disabled'
    : 'interactive.text.gray.normal';

  // For multiple selection: when a single option is selected we show its name (no redundant
  // "1" counter); once more than one is selected we collapse to a compact counter.
  if (selectionType === 'multiple' && Array.isArray(value)) {
    if (value.length === 1) {
      return (
        <Text size="small" weight="medium" color={valueColor} truncateAfterLines={1}>
          {typeof value[0] === 'string' ? value[0] : ''}
        </Text>
      );
    }
    return (
      <Box alignItems="center" flexDirection="row">
        <Counter value={value.length} color="neutral" size="small" />
      </Box>
    );
  }

  return (
    <Text size="small" weight="medium" color={valueColor}>
      {typeof value === 'string' ? value : ''}
    </Text>
  );
};

const _BaseFilterChip: React.ForwardRefRenderFunction<View, BaseFilterChipProps> = (
  {
    value,
    onClearButtonClick,
    label,
    isDisabled,
    selectionType = 'single',
    showClearButton = true,
    onClick,
    onKeyDown,
    accessibilityProps,
    id,
    ...rest
  }: BaseFilterChipProps,
  ref: React.Ref<View>,
): React.ReactElement => {
  const { theme } = useTheme();
  const isSelected =
    selectionType === 'multiple' ? Array.isArray(value) && value.length > 0 : !!value;
  const shouldShowClearButton = isSelected && showClearButton;

  const [chipSize, setChipSize] = React.useState({ width: 0, height: 0 });
  const handleLayout = (event: LayoutChangeEvent): void => {
    const { width, height } = event.nativeEvent.layout;
    setChipSize((prev) =>
      prev.width === width && prev.height === height ? prev : { width, height },
    );
  };

  return (
    <StyledFilterChip
      $isDisabled={isDisabled}
      $isSelected={isSelected}
      ref={ref}
      onLayout={isSelected ? undefined : handleLayout}
    >
      <StyledFilterTrigger
        $hasClearButton={shouldShowClearButton}
        disabled={isDisabled}
        id={id}
        onPress={
          isDisabled
            ? undefined
            : (e: GestureResponderEvent) => {
                onClick?.((e as unknown) as React.MouseEventHandler);
              }
        }
        {...(({
          onKeyDown: isDisabled
            ? undefined
            : (e: GestureResponderEvent) => {
                onKeyDown?.((e as unknown) as React.KeyboardEvent<Element>);
              },
        } as unknown) as Record<string, unknown>)}
        {...makeAccessible({
          ...accessibilityProps,
          role: accessibilityProps?.role ?? 'button',
        })}
        {...makeAnalyticsAttribute(rest)}
        {...metaAttribute({ name: 'filter-chip-trigger', testID: rest.testID })}
      >
        <Box flexDirection="row" gap="spacing.2" alignItems="center">
          <Text
            size="small"
            weight="medium"
            color="interactive.text.gray.subtle"
            truncateAfterLines={1}
          >
            {label}
            {isSelected ? ':' : null}
          </Text>
          {isSelected ? renderValue(selectionType, value, isDisabled) : null}
        </Box>
        <Box flexDirection="row" alignItems="center" paddingRight="spacing.1">
          <ChevronDownIcon size="small" color="interactive.icon.gray.muted" />
        </Box>
      </StyledFilterTrigger>
      {shouldShowClearButton ? (
        <>
          <Divider orientation="vertical" variant={isDisabled ? 'muted' : 'subtle'} />
          <StyledFilterCloseButton
            {...makeAccessible({ label: `Clear ${label} value`, role: 'button' })}
            // value can never be undefined because when it's undefined the button itself doesn't render
            onPress={isDisabled ? undefined : () => onClearButtonClick?.({ value: value ?? '' })}
            disabled={isDisabled}
            {...metaAttribute({ name: 'filter-chip-close-button' })}
          >
            <CloseIcon size="small" color="interactive.icon.gray.muted" />
          </StyledFilterCloseButton>
        </>
      ) : null}
      {isSelected ? null : (
        <DashedBorder
          width={chipSize.width}
          height={chipSize.height}
          borderRadius={theme.border.radius.small}
          strokeWidth={makeBorderSize(theme.border.width.thin)}
          color={theme.colors.interactive.border.gray[isDisabled ? 'disabled' : 'faded']}
        />
      )}
    </StyledFilterChip>
  );
};

const BaseFilterChip = assignWithoutSideEffects(React.forwardRef(_BaseFilterChip), {
  componentId: MetaConstants.BaseFilterChip,
});

export { BaseFilterChip };
