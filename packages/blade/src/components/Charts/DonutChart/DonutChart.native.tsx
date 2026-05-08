import React from 'react';
import type { ChartDonutWrapperProps, ChartDonutProps, ChartDonutCellProps } from './types';
import { Text } from '~components/Typography';
import { logger } from '~utils/logger';

const ChartDonutWrapper = (_prop: ChartDonutWrapperProps): React.ReactElement => {
  logger({
    type: 'warn',
    message: 'ChartDonutWrapper is not yet implemented for native',
    moduleName: 'ChartDonutWrapper',
  });

  return <Text>ChartDonutWrapper is not available for Native mobile apps.</Text>;
};

const ChartDonut = (_prop: ChartDonutProps): React.ReactElement => {
  logger({
    type: 'warn',
    message: 'ChartDonut is not yet implemented for native',
    moduleName: 'ChartDonut',
  });

  return <Text>ChartDonut is not available for Native mobile apps.</Text>;
};

const ChartDonutCell = (_prop: ChartDonutCellProps): React.ReactElement => {
  logger({
    type: 'warn',
    message: 'ChartDonutCell is not yet implemented for native',
    moduleName: 'ChartDonutCell',
  });

  return <Text>ChartDonut is not available for Native mobile apps.</Text>;
};

export type { ChartDonutWrapperProps, ChartDonutProps, ChartDonutCellProps };
export { ChartDonutWrapper, ChartDonut, ChartDonutCell };
