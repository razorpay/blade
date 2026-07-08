import React from 'react';
import { Pressable, View } from 'react-native';
import styled from 'styled-components/native';
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
import type { Theme } from '~components/BladeProvider';

const FILTER_CHIP_HEIGHT_NATIVE = size['28'];

const StyledFilterChip = styled(View)<{
  theme: Theme;
  $isSelected?: boolean;
  $isDisabled?: boolean;
}>(({ theme, $isDisabled, $isSelected }) => {
  return {
    borderWidth: (makeBorderSize(theme.border.width.thin) as unknown) as number,
    borderColor: theme.colors.interactive.border.gray[$isDisabled ? 'disabled' : 'faded'],
    height: FILTER_CHIP_HEIGHT_NATIVE,
    borderRadius: theme.border.radius.small,
    borderStyle: $isSelected ? 'solid' : 'dashed',
    backgroundColor: theme.colors.surface.background.gray.intense,
    flexDirection: 'row',
    alignSelf: 'flex-start',
    overflow: 'hidden',
    opacity: $isDisabled ? 0.5 : 1,
  };
});

const StyledFilterTrigger = styled(Pressable)<{
  theme: Theme;
  $isSelected?: boolean;
}>(({ theme, $isSelected }) => {
  const { spacing } = theme;
  return {
    backgroundColor: 'transparent',
    borderRadius: $isSelected ? 0 : theme.border.radius.small,
    borderTopLeftRadius: theme.border.radius.small,
    borderBottomLeftRadius: theme.border.radius.small,
    paddingLeft: spacing[4],
    paddingRight: $isSelected ? spacing[2] : spacing[3],
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
  if (selectionType === 'multiple' && Array.isArray(value)) {
    return (
      <Box alignItems="center" flexDirection="row">
        <Counter value={value.length} color="neutral" size="small" />
      </Box>
    );
  }

  return (
    <Text
      size="small"
      weight="medium"
      color={isDisabled ? 'interactive.text.gray.disabled' : 'interactive.text.gray.normal'}
    >
      {value as string}
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
    onClick,
    accessibilityProps,
    id,
    ...rest
  }: BaseFilterChipProps,
  ref: React.Ref<View>,
): React.ReactElement => {
  const isSelected =
    selectionType === 'multiple' ? Array.isArray(value) && value.length > 0 : !!value;

  return (
    <StyledFilterChip $isDisabled={isDisabled} $isSelected={isSelected} ref={ref}>
      <StyledFilterTrigger
        $isSelected={isSelected}
        disabled={isDisabled}
        onPress={
          isDisabled
            ? undefined
            : // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (e: any) => {
                onClick?.(e);
              }
        }
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
      {isSelected ? (
        <>
          <Divider orientation="vertical" variant={isDisabled ? 'muted' : 'subtle'} />
          <StyledFilterCloseButton
            accessibilityLabel={`Clear ${label} value`}
            onPress={isDisabled ? undefined : () => onClearButtonClick?.({ value: value ?? '' })}
            disabled={isDisabled}
            {...metaAttribute({ name: 'filter-chip-close-button' })}
          >
            <CloseIcon size="small" color="interactive.icon.gray.muted" />
          </StyledFilterCloseButton>
        </>
      ) : null}
    </StyledFilterChip>
  );
};

const BaseFilterChip = assignWithoutSideEffects(React.forwardRef(_BaseFilterChip), {
  componentId: MetaConstants.BaseFilterChip,
});

export { BaseFilterChip };
