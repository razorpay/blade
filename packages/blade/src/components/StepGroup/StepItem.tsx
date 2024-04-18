import React from 'react';
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

type GetStepTypeFromIndexProps = {
  _index: StepItemProps['_index'];
  _nestingLevel: StepGroupProps['_nestingLevel'];
  itemsCount: StepGroupContextType['itemsInGroupCount'];
};

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

const _StepItem = ({ _index, _totalIndex, _nestingLevel }: StepItemProps): React.ReactElement => {
  const { itemsInGroupCount: itemsCount, totalItemsInParentGroupCount } = useStepGroup();
  const stepType = React.useMemo(
    () => getStepTypeFromIndex({ _index, _nestingLevel, itemsCount }),
    [_index, _nestingLevel, itemsCount],
  );

  const isFirstItem = _totalIndex === 0;
  const isLastItem = _totalIndex === totalItemsInParentGroupCount - 1;

  return (
    <BaseBox
      display="flex"
      flexDirection="row"
      gap="spacing.4"
      // This is just for debugging purpose
      data-stepIndex={_index}
      className="step-item"
    >
      <StepLine
        shouldShowStartBranch={!isFirstItem}
        shouldShowEndBranch={!isLastItem}
        stepType={stepType}
        color="neutral"
        icon={CheckIcon}
      />
      <Box paddingY="spacing.3" marginTop="spacing.3" paddingX="spacing.4">
        <Text size="large" color="surface.text.gray.subtle" weight="semibold">
          Header {isFirstItem ? 'First' : isLastItem ? 'Last' : 'Middle'} {_index} / {_totalIndex}
        </Text>
        <Text marginY="spacing.2" size="medium" color="surface.text.gray.muted" variant="caption">
          Wed, 27th Mar&apos;24 | 12:00pm
        </Text>
        <Text size="medium" color="surface.text.gray.muted">
          Description
        </Text>
      </Box>
    </BaseBox>
  );
};

const StepItem = assignWithoutSideEffects(_StepItem, {
  componentId: componentIds.StepItem,
  displayName: componentIds.StepItem,
});

export { StepLine, StepItem };
