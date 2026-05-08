import type { StepItemProps } from './types';
import { Text } from '~components/Typography';
import { logger } from '~utils/logger';

const StepItem = (_props: StepItemProps): React.ReactElement => {
  logger({
    type: 'warn',
    message: 'StepItem is not yet implemented for native',
    moduleName: 'StepItem',
  });

  return <Text>StepItem Component is not available for Native mobile apps.</Text>;
};

export { StepItem };
