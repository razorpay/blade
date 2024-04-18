import React from 'react';
import styled from 'styled-components';
import { StepLine } from './StepLine';
import type { StepLineProps } from './StepLine';
import { useStepGroup } from './StepGroupContext';
import type { StepGroupContextType, StepGroupProps, StepItemProps } from './types';
import { componentIds } from './componentIds';
import { Box } from '~components/Box';
import { CheckIcon } from '~components/Icons';
import { Text } from '~components/Typography';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import BaseBox from '~components/Box/BaseBox';
import { makeSize, makeSpace } from '~utils';
import { size as sizeTokens } from '~tokens/global';
import { getFocusRingStyles } from '~utils/getFocusRingStyles';

type GetStepTypeFromIndexProps = {
  _index: StepItemProps['_index'];
  _nestingLevel: StepGroupProps['_nestingLevel'];
  itemsCount: StepGroupContextType['itemsInGroupCount'];
};

const InteractiveItemBox = styled.button<{ isSelected: StepItemProps['isSelected'] }>((props) => {
  const spacing = props.theme.spacing;
  return {
    padding: `${makeSpace(spacing[3])} ${makeSpace(spacing[4])}`,
    cursor: 'pointer',
    display: 'inline-block',
    textDecoration: 'none',
    border: 'none',
    textAlign: 'left',
    backgroundColor: props.isSelected
      ? props.theme.colors.interactive.background.primary.faded
      : props.theme.colors.transparent,
    borderRadius: props.theme.border.radius.medium,
    minWidth: makeSize(sizeTokens['314']),
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
  stepProgress = 'full',
  leading,
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
  const { itemsInGroupCount: itemsCount, totalItemsInParentGroupCount } = useStepGroup();
  const stepType = React.useMemo(
    () => getStepTypeFromIndex({ _index, _nestingLevel, itemsCount }),
    [_index, _nestingLevel, itemsCount],
  );

  const isFirstItem = _totalIndex === 0;
  const isLastItem = _totalIndex === totalItemsInParentGroupCount - 1;
  const isInteractive = Boolean(href) || Boolean(onClick);

  const titleTimestampDescription = (
    <>
      <Text size="large" color="surface.text.gray.subtle" weight="semibold">
        {title}
      </Text>
      <Text marginY="spacing.2" size="medium" color="surface.text.gray.muted" variant="caption">
        {timestamp}
      </Text>
      <Text size="medium" color="surface.text.gray.muted">
        {description}
      </Text>
    </>
  );

  return (
    <BaseBox
      display="flex"
      flexDirection="row"
      gap="spacing.4"
      className={`step-item step-index-${_index} step-nesting-level-${_nestingLevel}`}
    >
      <StepLine
        shouldShowStartBranch={!isFirstItem}
        shouldShowEndBranch={!isLastItem}
        stepType={stepType}
        color="neutral"
        icon={CheckIcon}
      />
      <Box marginTop="spacing.3">
        {isInteractive ? (
          <InteractiveItemBox
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
            {titleTimestampDescription}
          </InteractiveItemBox>
        ) : (
          <Box paddingY="spacing.3" paddingX="spacing.4">
            {titleTimestampDescription}
          </Box>
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
