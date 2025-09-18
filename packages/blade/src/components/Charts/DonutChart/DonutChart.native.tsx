import React from 'react';
import type { ChartDonutWrapperProps,  ChartDonutProps } from './types';
import { Text } from '~components/Typography';
import { throwBladeError } from '~utils/logger';

const ChartDonutWrapper = (_prop: ChartDonutWrapperProps): React.ReactElement => {
  throwBladeError({
    message: 'ChartDonutWrapper is not yet implemented for native',
    moduleName: 'ChartDonutWrapper',
  });

  return <Text>ChartDonutWrapper is not available for Native mobile apps.</Text>;
};

const ChartDonut = (_prop: ChartDonutProps): React.ReactElement => {
  throwBladeError({
    message: 'ChartDonut is not yet implemented for native',
    moduleName: 'ChartDonut',
  });

  return <Text>ChartDonut is not available for Native mobile apps.</Text>;
};

export type { ChartDonutWrapperProps, ChartDonutProps };
export { ChartDonutWrapper, ChartDonut };
