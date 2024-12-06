import React from 'react';
import styled from 'styled-components';
import { StepLine } from './StepLine';
import type { StepLineProps } from './StepLine';
import { useStepGroup } from './StepGroupContext';
import type {
  InteractiveItemHeaderProps,
  StepGroupContextType,
  StepGroupProps,
  StepItemProps,
} from './types';
import { componentIds } from './componentIds';
import { itemLineGap, stepItemHeaderTokens } from './tokens';
import { Box } from '~components/Box';
import { Text } from '~components/Typography';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import BaseBox from '~components/Box/BaseBox';
import { makeSize, makeSpace } from '~utils';
import { size as sizeTokens } from '~tokens/global';
import { getFocusRingStyles } from '~utils/getFocusRingStyles';
import getIn from '~utils/lodashButBetter/get';
import { throwBladeError } from '~utils/logger';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';

type GetStepTypeFromIndexProps = {
  _index: StepItemProps['_index'];
  _nestingLevel: StepGroupProps['_nestingLevel'];
  itemsCount: StepGroupContextType['itemsInGroupCount'];
};

const InteractiveItemHeaderBox = styled.button<InteractiveItemHeaderProps>((props) => {
  return {
    padding: `${makeSpace(getIn(props.theme, props.paddingY))} ${makeSpace(
      getIn(props.theme, props.paddingX),
    )}`,
    cursor: 'pointer',
    display: 'inline-block',
    textDecoration: 'none',
    border: 'none',
    textAlign: 'inherit',
    backgroundColor: props.isSelected
      ? props.theme.colors.interactive.background.primary.faded
      : props.theme.colors.transparent,
    borderRadius: props.theme.border.radius.medium,
    width: '100%',
    transition: `background-color ${props.theme.motion.duration.xquick} ${props.theme.motion.easing.standard}`,
    ':not([disabled]):hover': {
      backgroundColor: props.isSelected
        ? props.theme.colors.interactive.background.primary.fadedHighlighted
        : props.theme.colors.interactive.background.gray.fadedHighlighted,
    },
    ':not([disabled]):focus-visible': {
      ...getFocusRingStyles({ theme: props.theme }),
    },
    '&[disabled]': {
      cursor: 'not-allowed',
    },
  };
});

const getStepTypeFromIndex = ({
  _index,
  _nestingLevel,
  itemsCount,
}: GetStepTypeFromIndexProps): StepLineProps['stepType'] => {
  if (_nestingLevel === 0) {
    return 'default';
  }

  if (itemsCount === 1) {
    return 'single-item';
  }

  if (_index === 0) {
    return 'start';
  }

  if (_index === itemsCount - 1) {
    return 'end';
  }

  return 'middle';
};

const _StepItem = ({
  title,
  titleColor,
  timestamp,
  description,
  stepProgress = 'none',
  marker,
  trailing,
  isSelected,
  isDisabled,
  href,
  target,
  onClick,
  children,
  _index = 0,
  _totalIndex = 0,
  _nestingLevel = 0,
  ...rest
}: StepItemProps): React.ReactElement => {
  const {
    itemsInGroupCount: itemsCount,
    totalItemsInParentGroupCount,
    orientation,
    size,
  } = useStepGroup();
  const stepType = React.useMemo(
    () => getStepTypeFromIndex({ _index, _nestingLevel, itemsCount }),
    [_index, _nestingLevel, itemsCount],
  );

  const itemRef = React.useRef<HTMLDivElement>(null);

  const isFirstItem = _totalIndex === 0;
  const isLastItem = _totalIndex === totalItemsInParentGroupCount - 1;
  const isInteractive = Boolean(href) || Boolean(onClick);
  const isVertical = orientation === 'vertical';
  const isNested = _nestingLevel > 0;

  if (__DEV__) {
    if (trailing && orientation === 'horizontal') {
      throwBladeError({
        message: 'trailing is not allowed in horizontal StepGroup',
        moduleName: 'StepItem',
      });
    }

    if (_nestingLevel >= 1 && orientation === 'horizontal') {
      throwBladeError({
        message: 'Nested StepGroup components are not allowed in horizontal orientation',
        moduleName: 'StepItem',
      });
    }
  }

  const stepItemHeaderJSX = (
    <Box display="flex" flexDirection="row" justifyContent="space-between" gap="spacing.4">
      <Box>
        <Text
          size={stepItemHeaderTokens[size].title}
          color={
            isDisabled ? 'surface.text.gray.disabled' : titleColor ?? 'surface.text.gray.subtle'
          }
          weight={isNested ? 'regular' : 'semibold'}
        >
          {title}
        </Text>
        <Text
          size={stepItemHeaderTokens[size].timestamp}
          marginY="spacing.2"
          color={isDisabled ? 'surface.text.gray.disabled' : 'surface.text.gray.muted'}
          variant="caption"
        >
          {timestamp}
        </Text>
        <Text
          size={stepItemHeaderTokens[size].description}
          color={isDisabled ? 'surface.text.gray.disabled' : 'surface.text.gray.muted'}
        >
          {description}
        </Text>
      </Box>
      <Box>{trailing}</Box>
    </Box>
  );

  const stepItemHeaderPaddings: Omit<InteractiveItemHeaderProps, 'isSelected'> = {
    paddingY: 'spacing.3',
    paddingX: 'spacing.4',
  } as const;

  return (
    <BaseBox
      display="flex"
      flexDirection={isVertical ? 'row' : 'column'}
      gap={itemLineGap[size]}
      className={`step-item step-index-${_index} step-nesting-level-${_nestingLevel}`}
      textAlign={isVertical ? 'left' : 'center'}
      alignItems={isVertical ? undefined : 'center'}
      minWidth={isVertical ? undefined : `min(${makeSize(sizeTokens['120'])}, 100%)`}
      width={isVertical ? '100%' : undefined}
      flex={isVertical ? undefined : '1'}
      {...metaAttribute({ name: MetaConstants.StepItem })}
      {...makeAnalyticsAttribute(rest)}
      ref={itemRef}
    >
      <StepLine
        shouldShowStartBranch={!isFirstItem}
        shouldShowEndBranch={!isLastItem}
        stepType={stepType}
        marker={marker}
        stepProgress={stepProgress}
      />
      <Box flex="1" marginRight={isVertical ? undefined : undefined}>
        {isInteractive ? (
          <InteractiveItemHeaderBox
            {...stepItemHeaderPaddings}
            as={href ? 'a' : 'button'}
            href={href}
            target={target}
            isSelected={isSelected}
            onClick={onClick}
            disabled={isDisabled}
          >
            {stepItemHeaderJSX}
          </InteractiveItemHeaderBox>
        ) : (
          <Box {...stepItemHeaderPaddings}>{stepItemHeaderJSX}</Box>
        )}
        {children ? (
          <Box paddingX="spacing.4" paddingBottom="spacing.3">
            {children}
          </Box>
        ) : null}
      </Box>
    </BaseBox>
  );
};

/**
 * ## StepItem
 *
 * Component meant to be used inside the StepGroup parent component
 *
 * ### Usage
 *
 * ```jsx
 * <StepGroup orientation="vertical" size="medium">
 *   <StepItem
 *      title="Personal Details"
 *      timestamp="Thu 15th Oct'23 | 12:00pm"
 *      description="Fill your personal details here"
 *      marker={<StepItemIndicator color="negative" />}
 *    />
 * </StepGroup>
 * ```
 *
 * ---
 *
 * Checkout {@link https://blade.razorpay.com/?path=/docs/components-stepgroup--docs StepGroup Documentation}
 */
const StepItem = assignWithoutSideEffects(_StepItem, {
  componentId: componentIds.StepItem,
  displayName: componentIds.StepItem,
});

export { StepLine, StepItem };
