import React from 'react';
import type { ChartPieWrapperProps, ChartPieProps } from './types';
import { Text } from '~components/Typography';
import { throwBladeError } from '~utils/logger';

const ChartPieWrapper = (_prop: ChartPieWrapperProps): React.ReactElement => {
  throwBladeError({
    message: 'ChartPieWrapper is not yet implemented for native',
    moduleName: 'ChartPieWrapper',
  });

  return <Text>ChartPieWrapper is not available for Native mobile apps.</Text>;
};

const ChartPie = (_prop: ChartPieProps): React.ReactElement => {
  throwBladeError({
    message: 'ChartPie is not yet implemented for native',
    moduleName: 'ChartPie',
  });

  return <Text>ChartPie is not available for Native mobile apps.</Text>;
};

export type { ChartPieWrapperProps, ChartPieProps };
export { ChartPieWrapper, ChartPie };
