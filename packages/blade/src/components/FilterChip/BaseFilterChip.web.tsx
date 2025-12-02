import React from 'react';
import type { CSSObject } from 'styled-components';
import styled from 'styled-components';
import { FILTER_CHIP_HEIGHT } from './tokens';
import type { BaseFilterChipProps } from './types';
import { Box } from '~components/Box';
import BaseBox from '~components/Box/BaseBox';
import { Counter } from '~components/Counter';
import { Divider } from '~components/Divider';
import { ChevronDownIcon, CloseIcon } from '~components/Icons';
import { Text } from '~components/Typography';
import { makeBorderSize, makeSpace } from '~utils';
import { getFocusRingStyles } from '~utils/getFocusRingStyles';
import type { Theme } from '~components/BladeProvider';
import { getStyledProps } from '~components/Box/styledProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import type { BladeElementRef } from '~utils/types';
import { makeAccessible } from '~utils/makeAccessible';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';

const getInteractiveFilterItemStyles = ({ theme }: { theme: Theme }): CSSObject => {
  return {
    display: 'flex',
    height: '100%',
    alignItems: 'center',
    border: 'none',
    cursor: 'pointer',
    color: 'currentcolor',
    '&:not([disabled]):hover': {
      backgroundColor: theme.colors.interactive.background.gray.faded,
    },
    '&[disabled]': {
      cursor: 'not-allowed',
    },
    '&:focus-visible': {
      ...getFocusRingStyles({ theme }),
      outlineOffset: makeSpace(theme.spacing[1]),
    },
  };
};

const StyledFilterChip = styled(BaseBox)<{ $isSelected?: boolean; $isDisabled?: boolean }>(
  ({ theme, $isDisabled }) => {
    return {
      borderWidth: makeBorderSize(theme.border.width.thinner),
      borderColor: theme.colors.interactive.border.gray[$isDisabled ? 'disabled' : 'highlighted'],
      height: FILTER_CHIP_HEIGHT,
      borderRadius: theme.border.radius.max,
      display: 'flex',
      borderStyle: 'solid',
      backgroundColor: theme.colors.surface.background.gray.intense,
      color: theme.colors.interactive.text.gray[$isDisabled ? 'disabled' : 'normal'],
      width: 'fit-content',
    };
  },
);

const StyledFilterTrigger = styled.button<{ $isSelected?: boolean }>(({ theme, $isSelected }) => {
  const { spacing } = theme;
  return {
    backgroundColor: theme.colors.transparent,
    borderRadius: $isSelected ? theme.border.radius.none : theme.border.radius.max,
    borderTopLeftRadius: theme.border.radius.max,
    borderBottomLeftRadius: theme.border.radius.max,
    paddingLeft: makeSpace(spacing[4]),
    paddingRight: $isSelected ? makeSpace(spacing[2]) : makeSpace(spacing[3]),
    gap: makeSpace(spacing[2]),
    ...getInteractiveFilterItemStyles({ theme }),
  };
});

const StyledFilterCloseButton = styled.button(({ theme }) => {
  return {
    backgroundColor: theme.colors.transparent,
    borderTopRightRadius: theme.border.radius.max,
    borderBottomRightRadius: theme.border.radius.max,
    paddingLeft: makeSpace(theme.spacing[2]),
    paddingRight: makeSpace(theme.spacing[3]),
    justifyContent: 'center',
    ...getInteractiveFilterItemStyles({ theme }),
  };
});

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
      as="span"
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
    onKeyDown,
    accessibilityProps,
    id,
    ...rest
  }: BaseFilterChipProps,
  ref: React.Ref<BladeElementRef>,
): React.ReactElement => {
  const isSelected =
    selectionType === 'multiple' ? Array.isArray(value) && value.length > 0 : !!value;

  return (
    <StyledFilterChip
      $isDisabled={isDisabled}
      $isSelected={isSelected}
      ref={ref as React.Ref<HTMLDivElement>}
    >
      <StyledFilterTrigger
        $isSelected={isSelected}
        disabled={isDisabled}
        id={id}
        onClick={(e) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onClick?.(e as any);
        }}
        onKeyDown={(e) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onKeyDown?.(e as any);
        }}
        {...makeAccessible({
          ...accessibilityProps,
          role: accessibilityProps?.role ?? 'button',
        })}
        {...getStyledProps(rest)}
        {...makeAnalyticsAttribute(rest)}
        {...metaAttribute({ name: 'filter-chip-trigger' })}
      >
        <Box display="flex" gap="spacing.2" whiteSpace="nowrap">
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
      </StyledFilterTrigger>
      {isSelected ? (
        <>
          <Divider orientation="vertical" variant={isDisabled ? 'muted' : 'subtle'} />
          <StyledFilterCloseButton
            aria-label={`Clear ${label} value`}
            // value can never be undefined because when it's undefined the button itself doesn't render/
            onClick={() => onClearButtonClick?.({ value: value ?? '' })}
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
