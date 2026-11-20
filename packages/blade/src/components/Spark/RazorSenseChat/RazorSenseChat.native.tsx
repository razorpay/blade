import type { RazorSenseChatProps } from './types';
import { throwBladeError } from '~utils/logger';
import { Text } from '~components/Typography';

const RazorSenseChat = (_props: RazorSenseChatProps): React.ReactElement => {
  throwBladeError({
    message: 'RazorSenseChat is not yet implemented for React Native',
    moduleName: 'RazorSenseChat',
  });

  return <Text>RazorSenseChat is not available for Native mobile apps.</Text>;
};

export { RazorSenseChat };
