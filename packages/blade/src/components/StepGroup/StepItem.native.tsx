import type { StepItemProps } from './types';
import { Text } from '~components/Typography';
import { throwBladeError } from '~utils/logger';

const StepItem = (_props: StepItemProps): React.ReactElement => {
  throwBladeError({
    message: 'StepItem is not yet implemented for native',
    moduleName: 'StepItem',
  });

  return <Text>StepItem Component is not available for Native mobile apps.</Text>;
};

export { StepItem };
