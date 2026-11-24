import type { RayLoaderProps } from './types';
import { throwBladeError } from '~utils/logger';
import { Text } from '~components/Typography';

const RayLoader = (_props: RayLoaderProps): React.ReactElement => {
  throwBladeError({
    message: 'RayLoader is not yet implemented for React Native',
    moduleName: 'RayLoader',
  });

  return <Text>RayLoader is not available for Native mobile apps.</Text>;
};

export { RayLoader };
