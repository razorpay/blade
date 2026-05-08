import React from 'react';
import type { ChartBarProps, ChartBarWrapperProps } from './types';
import { Text } from '~components/Typography';
import { logger } from '~utils/logger';

const ChartBar = (_prop: ChartBarProps): React.ReactElement => {
  logger({
    type: 'warn',
    message: 'ChartBar is not yet implemented for native',
    moduleName: 'ChartBar',
  });

  return <Text>ChartBar is not available for Native mobile apps.</Text>;
};

const ChartBarWrapper = (_prop: ChartBarWrapperProps): React.ReactElement => {
  logger({
    type: 'warn',
    message: 'ChartBarWrapper is not yet implemented for native',
    moduleName: 'ChartBarWrapper',
  });

  return <Text>ChartLine is not available for Native mobile apps.</Text>;
};

export type { ChartBarProps, ChartBarWrapperProps };
export { ChartBar, ChartBarWrapper };
