import { Text } from '~components/Typography';
import { throwBladeError } from '~utils/logger';
import { ScaleProps } from './types';

const Scale = (_props: ScaleProps): React.ReactElement => {
  throwBladeError({
    message: 'Scale is not yet implemented for native',
    moduleName: 'Scale',
  });

  return <Text>Scale Component is not available for Native mobile apps.</Text>;
};

export { Scale };
