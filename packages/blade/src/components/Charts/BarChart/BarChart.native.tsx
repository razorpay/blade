import React from 'react';
import { Text } from '~components/Typography';
import { throwBladeError } from '~utils/logger';

import type { ChartBarProps, ChartBarWrapperProps } from './types';

const ChartBar = (_prop: ChartBarProps): React.ReactElement => {
  throwBladeError({
    message: 'ChartBar is not yet implemented for native',
    moduleName: 'ChartBar',
  });

  return <Text>ChartBar is not available for Native mobile apps.</Text>;
};

const ChartBarWrapper = (_prop: ChartBarWrapperProps): React.ReactElement => {
  throwBladeError({
    message: 'ChartBarWrapper is not yet implemented for native',
    moduleName: 'ChartBarWrapper',
  });

  return <Text>ChartLine is not available for Native mobile apps.</Text>;
};

export type { ChartBarProps, ChartBarWrapperProps };
export { ChartBar, ChartBarWrapper };
