import React from 'react';
import { componentIds } from './tokens';
import type { ChartFunnelProps, ChartFunnelWrapperProps } from './types';
import { Text } from '~components/Typography';
import { throwBladeError } from '~utils/logger';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const ChartFunnelWrapper = (_props: ChartFunnelWrapperProps): React.ReactElement => {
  throwBladeError({
    message: 'FunnelChart is not yet implemented for native',
    moduleName: 'FunnelChart',
  });

  return <Text>FunnelChart Component is not available for Native mobile apps.</Text>;
};

const _ChartFunnel = (_props: ChartFunnelProps): React.ReactElement => {
  return <Text>ChartFunnel Component is not available for Native mobile apps.</Text>;
};

const ChartFunnel = assignWithoutSideEffects(_ChartFunnel, {
  componentId: componentIds.chartFunnel,
});

export { ChartFunnelWrapper, ChartFunnel };
