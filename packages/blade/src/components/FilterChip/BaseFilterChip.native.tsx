import React from 'react';
import { Pressable } from 'react-native';
import { FILTER_CHIP_HEIGHT } from './tokens';
import type { BaseFilterChipProps } from './types';
import { Box } from '~components/Box';
import BaseBox from '~components/Box/BaseBox';
import { Counter } from '~components/Counter';
import { Divider } from '~components/Divider';
import { ChevronDownIcon, CloseIcon } from '~components/Icons';
import { Text } from '~components/Typography';
import { useTheme } from '~components/BladeProvider';
import { getStyledProps } from '~components/Box/styledProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import type { BladeElementRef } from '~utils/types';
import { makeAccessible } from '~utils/makeAccessible';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import getIn from '~utils/lodashButBetter/get';

const renderValue = (
  selectionType: BaseFilterChipProps['selectionType'],
  value: BaseFilterChipProps['value'],
  isDisabled?: boolean,
): React.ReactElement => {
  if (selectionType === 'multiple' && Array.isArray(value)) {
    return (
      <Box display="flex" alignItems="center">
        <Counter value={value.length} color={isDisabled ? 'neutral' : 'primary'} size="small" />
      </Box>
    );
  }

  return (
    <Text
      size="xsmall"
      weight="semibold"
      color={isDisabled ? 'interactive.text.gray.disabled' : 'interactive.text.primary.normal'}
    >
      {value}
    </Text>
  );
};

const _BaseFilterChip: React.ForwardRefRenderFunction<BladeElementRef, BaseFilterChipProps> = (
  {
    value,
    onClearButtonClick,
    label,
    isDisabled,
    selectionType = 'single',
    onClick,
    accessibilityProps,
    id,
    ...rest
  }: BaseFilterChipProps,
  ref: React.Ref<BladeElementRef>,
): React.ReactElement => {
  const { theme } = useTheme();
  const isSelected =
    selectionType === 'multiple' ? Array.isArray(value) && value.length > 0 : !!value;

  const borderColor = getIn(
    theme.colors,
    `interactive.border.gray.${isDisabled ? 'disabled' : 'highlighted'}`,
    '',
  );
  const textColor = isDisabled ? 'interactive.text.gray.disabled' : 'interactive.text.gray.normal';

  return (
    <BaseBox
      ref={ref as never}
      display="flex"
      flexDirection="row"
      alignItems="center"
      style={{
        borderWidth: theme.border.width.thinner,
        borderColor,
        height: FILTER_CHIP_HEIGHT,
        borderRadius: theme.border.radius.max,
        borderStyle: 'solid',
        backgroundColor: getIn(theme.colors, 'surface.background.gray.intense', ''),
      }}
    >
      <Pressable
        onPress={(e) => onClick?.(e as never)}
        disabled={isDisabled}
        accessibilityRole={accessibilityProps?.role ?? 'button'}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          height: '100%',
          paddingLeft: theme.spacing[4],
          paddingRight: isSelected ? theme.spacing[2] : theme.spacing[3],
          gap: theme.spacing[2],
          borderTopLeftRadius: theme.border.radius.max,
          borderBottomLeftRadius: theme.border.radius.max,
          borderTopRightRadius: isSelected ? 0 : theme.border.radius.max,
          borderBottomRightRadius: isSelected ? 0 : theme.border.radius.max,
          opacity: isDisabled ? 0.5 : 1,
        }}
        {...getStyledProps(rest)}
        {...makeAnalyticsAttribute(rest)}
        {...metaAttribute({ name: 'filter-chip-trigger', testID: rest.testID })}
      >
        <Box display="flex" flexDirection="row" gap="spacing.2">
          <Text
            size="xsmall"
            weight="medium"
            color="interactive.text.gray.subtle"
            truncateAfterLines={1}
          >
            {label}
            {isSelected ? ':' : null}
          </Text>
          {isSelected ? renderValue(selectionType, value, isDisabled) : null}
        </Box>
        <Box display="flex" alignItems="center" paddingRight="spacing.1">
          <ChevronDownIcon size="small" color="interactive.icon.gray.muted" />
        </Box>
      </Pressable>
      {isSelected ? (
        <>
          <Divider orientation="vertical" variant={isDisabled ? 'muted' : 'subtle'} />
          <Pressable
            accessibilityLabel={`Clear ${label} value`}
            onPress={() => onClearButtonClick?.({ value: value ?? '' })}
            disabled={isDisabled}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              paddingLeft: theme.spacing[2],
              paddingRight: theme.spacing[3],
              height: '100%',
              borderTopRightRadius: theme.border.radius.max,
              borderBottomRightRadius: theme.border.radius.max,
              opacity: isDisabled ? 0.5 : 1,
            }}
            {...metaAttribute({ name: 'filter-chip-close-button' })}
          >
            <CloseIcon size="small" color="interactive.icon.gray.muted" />
          </Pressable>
        </>
      ) : null}
    </BaseBox>
  );
};

const BaseFilterChip = assignWithoutSideEffects(React.forwardRef(_BaseFilterChip), {
  componentId: MetaConstants.BaseFilterChip,
});

export { BaseFilterChip };
