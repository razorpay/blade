import type { FreshLLMProps } from './types';
import { throwBladeError } from '~utils/logger';
import { Text } from '~components/Typography';

const FreshLLM = (_props: FreshLLMProps): React.ReactElement => {
  throwBladeError({
    message: 'FreshLLM is not yet implemented for React Native',
    moduleName: 'FreshLLM',
  });

  return <Text>FreshLLM is not available for Native mobile apps.</Text>;
};

export { FreshLLM };
