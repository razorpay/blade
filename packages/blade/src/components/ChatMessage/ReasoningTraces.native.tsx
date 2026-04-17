import React from 'react';
import type { ReasoningTracesProps } from './types';
import { Text } from '~components/Typography';
import { throwBladeError } from '~utils/logger';

// Upfront mode: all steps are known; activeStepIndex contro
const ReasoningTraces = (_prop: ReasoningTracesProps): React.ReactElement => {
  throwBladeError({
    message: 'ReasoningTraces is not yet implemented for native',
    moduleName: 'ReasoningTraces',
  });

  return <Text>ReasoningTraces is not available for Native mobile apps.</Text>;
};

export { ReasoningTraces };
