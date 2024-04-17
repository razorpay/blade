import React from 'react';
import { StepLine } from './StepLine';
import type { StepLineProps } from './StepLine';
import { useStepGroup } from './StepGroupContext';
import type { StepGroupContextType, StepItemProps } from './types';
import { componentIds } from './componentIds';
import { Box } from '~components/Box';
import { CheckIcon } from '~components/Icons';
import { Text } from '~components/Typography';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

type GetStepTypeFromIndexProps = {
  _index: StepItemProps['_index'];
  nestingLevel: StepGroupContextType['nestingLevel'];
  itemsCount: StepGroupContextType['itemsCount'];
};

const getStepTypeFromIndex = ({
  _index,
  nestingLevel,
  itemsCount,
}: GetStepTypeFromIndexProps): StepLineProps['stepType'] => {
  if (nestingLevel === 0) {
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

const _StepItem = ({ _index, _isFirstItem, _isLastItem }: StepItemProps): React.ReactElement => {
  const { nestingLevel, itemsCount } = useStepGroup();
  const stepType = React.useMemo(() => getStepTypeFromIndex({ _index, nestingLevel, itemsCount }), [
    _index,
    nestingLevel,
    itemsCount,
  ]);

  if (nestingLevel === 0) {
    console.log(_index);
  }

  console.log({ _isFirstItem, _isLastItem });

  return (
    <Box
      display="flex"
      flexDirection="row"
      gap="spacing.4"
      // This is just for debugging purpose
      data-stepIndex={_index}
    >
      <StepLine stepType={stepType} color="neutral" icon={CheckIcon} />
      <Box paddingY="spacing.3" marginTop="spacing.3" paddingX="spacing.4">
        <Text size="large" color="surface.text.gray.subtle" weight="semibold">
          Header First: {_isFirstItem ? 'true' : null} Last: {_isLastItem ? 'true' : null}
        </Text>
        <Text marginY="spacing.2" size="medium" color="surface.text.gray.muted" variant="caption">
          Wed, 27th Mar&apos;24 | 12:00pm
        </Text>
        <Text size="medium" color="surface.text.gray.muted">
          Description
        </Text>
      </Box>
    </Box>
  );
};

const StepItem = assignWithoutSideEffects(_StepItem, {
  componentId: componentIds.StepItem,
  displayName: componentIds.StepItem,
});

export { StepLine, StepItem };
