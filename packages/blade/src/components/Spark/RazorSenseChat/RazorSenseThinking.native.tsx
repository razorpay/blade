import type { RazorSenseThinkingProps } from './types';
import { throwBladeError } from '~utils/logger';
import { Text } from '~components/Typography';

const RazorSenseThinking = (_props: RazorSenseThinkingProps): React.ReactElement => {
  throwBladeError({
    message: 'RazorSenseThinking is not yet implemented for React Native',
    moduleName: 'RazorSenseThinking',
  });

  return <Text>RazorSenseThinking is not available for Native mobile apps.</Text>;
};

export { RazorSenseThinking };
