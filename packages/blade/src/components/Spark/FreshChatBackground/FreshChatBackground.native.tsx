import type { FreshChatBackgroundProps } from './types';
import { throwBladeError } from '~utils/logger';
import { Text } from '~components/Typography';

const FreshChatBackground = (_props: FreshChatBackgroundProps): React.ReactElement => {
  throwBladeError({
    message: 'FreshChatBackground is not yet implemented for React Native',
    moduleName: 'FreshChatBackground',
  });

  return <Text>FreshChatBackground is not available for Native mobile apps.</Text>;
};

export { FreshChatBackground };
