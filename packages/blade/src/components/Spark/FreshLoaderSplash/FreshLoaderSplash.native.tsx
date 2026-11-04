import type { FreshLoaderSplashProps } from './types';
import { throwBladeError } from '~utils/logger';
import { Text } from '~components/Typography';

const FreshLoaderSplash = (_props: FreshLoaderSplashProps): React.ReactElement => {
  throwBladeError({
    message: 'FreshLoaderSplash is not yet implemented for React Native',
    moduleName: 'FreshLoaderSplash',
  });

  return <Text>FreshLoaderSplash is not available for Native mobile apps.</Text>;
};

export { FreshLoaderSplash };
