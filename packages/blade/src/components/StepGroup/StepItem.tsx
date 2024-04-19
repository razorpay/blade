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
    minWidth: props.minWidth,
    transition: `background-color ${props.theme.motion.duration.xquick} ${props.theme.motion.easing.standard.effective}`,
    ':hover': {
      backgroundColor: props.isSelected
        ? props.theme.colors.interactive.background.primary.fadedHighlighted
        : props.theme.colors.interactive.background.gray.fadedHighlighted,
    },
    ':focus-visible': {
      ...getFocusRingStyles({ theme: props.theme }),
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
  timestamp,
  description,
  stepProgress = 'none',
  marker,
  trailing,
  isSelected,
  href,
  target,
  onClick,
  children,
  _index = 0,
  _totalIndex = 0,
  _nestingLevel = 0,
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

  const isFirstItem = _totalIndex === 0;
  const isLastItem = _totalIndex === totalItemsInParentGroupCount - 1;
  const isInteractive = Boolean(href) || Boolean(onClick);

  if (trailing && orientation === 'horizontal') {
    throwBladeError({
      message: 'trailing is not allowed in horizontal StepGroup',
      moduleName: 'StepItem',
    });
  }

  const stepItemHeaderJSX = (
    <Box display="flex" flexDirection="row" justifyContent="space-between" gap="spacing.4">
      <Box>
        <Text
          size={stepItemHeaderTokens[size].title}
          color="surface.text.gray.subtle"
          weight="semibold"
        >
          {title}
        </Text>
        <Text
          size={stepItemHeaderTokens[size].timestamp}
          marginY="spacing.2"
          color="surface.text.gray.muted"
          variant="caption"
        >
          {timestamp}
        </Text>
        <Text size={stepItemHeaderTokens[size].description} color="surface.text.gray.muted">
          {description}
        </Text>
      </Box>
      <Box>{trailing}</Box>
    </Box>
  );

  const stepItemHeaderPaddings: Omit<InteractiveItemHeaderProps, 'isSelected'> = {
    paddingY: 'spacing.3',
    paddingX: 'spacing.4',
    minWidth: `min(${makeSize(
      orientation === 'horizontal' ? sizeTokens['176'] : sizeTokens['314'],
    )}, 100%)`,
  } as const;

  return (
    <BaseBox
      display="flex"
      flexDirection={orientation === 'vertical' ? 'row' : 'column'}
      gap={itemLineGap[size]}
      className={`step-item step-index-${_index} step-nesting-level-${_nestingLevel}`}
      textAlign={orientation === 'vertical' ? 'left' : 'center'}
      alignItems={orientation === 'vertical' ? undefined : 'center'}
    >
      <StepLine
        shouldShowStartBranch={!isFirstItem}
        shouldShowEndBranch={!isLastItem}
        stepType={stepType}
        marker={marker}
        stepProgress={stepProgress}
      />
      <Box marginTop="spacing.3" flex="1">
        {isInteractive ? (
          <InteractiveItemHeaderBox
            {...stepItemHeaderPaddings}
            as={href ? 'a' : 'button'}
            href={href}
            target={target}
            isSelected={isSelected}
            onClick={() =>
              onClick?.({
                itemIndex: _index,
                nestingLevel: _nestingLevel,
                groupItemIndex: _totalIndex,
              })
            }
          >
            {stepItemHeaderJSX}
          </InteractiveItemHeaderBox>
        ) : (
          <Box {...stepItemHeaderPaddings}>{stepItemHeaderJSX}</Box>
        )}
        {children ? (
          <Box paddingX="spacing.4" paddingY="spacing.3">
            {children}
          </Box>
        ) : null}
      </Box>
    </BaseBox>
  );
};

const StepItem = assignWithoutSideEffects(_StepItem, {
  componentId: componentIds.StepItem,
  displayName: componentIds.StepItem,
});

export { StepLine, StepItem };
