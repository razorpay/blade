import type { ChartAreaWrapperProps, ChartAreaProps } from './types';
import { logger } from '~utils/logger';
import { Text } from '~components/Typography';

const ChartAreaWrapper = (_prop: ChartAreaProps): React.ReactElement => {
  logger({
    type: 'warn',
    message: 'ChartAreaWrapper is not yet implemented for native',
    moduleName: 'ChartAreaWrapper',
  });

  return <Text>AreaChartWrapper is not available for Native mobile apps.</Text>;
};

const ChartArea = (_prop: ChartAreaWrapperProps): React.ReactElement => {
  logger({
    type: 'warn',
    message: 'ChartArea is not yet implemented for native',
    moduleName: 'ChartArea',
  });

  return <Text>ChartArea is not available for Native mobile apps.</Text>;
};

export { ChartAreaWrapper, ChartArea };
