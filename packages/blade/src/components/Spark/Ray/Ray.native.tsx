import type { RayProps } from './types';
import { throwBladeError } from '~utils/logger';
import { Text } from '~components/Typography';

const Ray = (_props: RayProps): React.ReactElement => {
  throwBladeError({
    message: 'Ray is not yet implemented for React Native',
    moduleName: 'Ray',
  });

  return <Text>Ray is not available for Native mobile apps.</Text>;
};

export { Ray };
