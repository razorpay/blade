import type { RazorSenseLoaderProps } from './types';
import { throwBladeError } from '~utils/logger';
import { Text } from '~components/Typography';

const RazorSenseLoader = (_props: RazorSenseLoaderProps): React.ReactElement => {
  throwBladeError({
    message: 'RazorSenseLoader is not yet implemented for React Native',
    moduleName: 'RazorSenseLoader',
  });

  return <Text>RazorSenseLoader is not available for Native mobile apps.</Text>;
};

export { RazorSenseLoader };
