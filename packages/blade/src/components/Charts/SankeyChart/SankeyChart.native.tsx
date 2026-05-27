import React from 'react';
import type { ChartSankeyWrapperProps, ChartSankeyProps } from './types';
import { Text } from '~components/Typography';
import { throwBladeError } from '~utils/logger';

const ChartSankeyWrapper = (_props: ChartSankeyWrapperProps): React.ReactElement => {
  throwBladeError({
    message: 'ChartSankeyWrapper is not yet implemented for native',
    moduleName: 'ChartSankeyWrapper',
  });

  return <Text>ChartSankeyWrapper is not available for Native mobile apps.</Text>;
};

const ChartSankey = (_props: ChartSankeyProps): React.ReactElement => {
  throwBladeError({
    message: 'ChartSankey is not yet implemented for native',
    moduleName: 'ChartSankey',
  });

  return <Text>ChartSankey is not available for Native mobile apps.</Text>;
};

export type { ChartSankeyWrapperProps, ChartSankeyProps };
export { ChartSankeyWrapper, ChartSankey };
