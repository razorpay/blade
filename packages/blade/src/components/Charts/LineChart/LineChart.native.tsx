import React from 'react';
import type { ChartLineProps, ChartLineWrapperProps } from './types';
import { Text } from '~components/Typography';
import { throwBladeError } from '~utils/logger';

const ChartLineWrapper = (_prop: ChartLineWrapperProps): React.ReactElement => {
  throwBladeError({
    message: 'ChartLineWrapper is not yet implemented for native',
    moduleName: 'ChartLineWrapper',
  });

  return <Text>ChartLineWrapper is not available for Native mobile apps.</Text>;
};

const ChartLine = (_prop: ChartLineProps): React.ReactElement => {
  throwBladeError({
    message: 'ChartLine is not yet implemented for native',
    moduleName: 'ChartLine',
  });

  return <Text>ChartLine is not available for Native mobile apps.</Text>;
};

export type { ChartLineWrapperProps, ChartLineProps };
export { ChartLineWrapper, ChartLine };
