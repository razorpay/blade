import { Text } from '~components/Typography';
import { throwBladeError } from '~utils/logger';

const StepLine = (_props: unknown): React.ReactElement => {
  throwBladeError({
    message: 'StepLine is not yet implemented for native',
    moduleName: 'StepLine',
  });

  return <Text>StepLine Component is not available for Native mobile apps.</Text>;
};

export { StepLine };
