import type { StepGroupProps } from './types';
import { Text } from '~components/Typography';
import { throwBladeError } from '~utils/logger';

const StepGroup = (_props: StepGroupProps): React.ReactElement => {
  throwBladeError({
    message: 'StepGroup is not yet implemented for native',
    moduleName: 'StepGroup',
  });

  return <Text>StepGroup Component is not available for Native mobile apps.</Text>;
};

export { StepGroup };
