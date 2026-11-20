import type { RazorSenseChatBackgroundProps } from './types';
import { throwBladeError } from '~utils/logger';
import { Text } from '~components/Typography';

const RazorSenseChatBackground = (_props: RazorSenseChatBackgroundProps): React.ReactElement => {
  throwBladeError({
    message: 'RazorSenseChatBackground is not yet implemented for React Native',
    moduleName: 'RazorSenseChatBackground',
  });

  return <Text>RazorSenseChatBackground is not available for Native mobile apps.</Text>;
};

export { RazorSenseChatBackground };
