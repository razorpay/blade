import type { RayChatOutputProps } from './types';
import { throwBladeError } from '~utils/logger';
import { Text } from '~components/Typography';

const RayChatOutput = (_props: RayChatOutputProps): React.ReactElement => {
  throwBladeError({
    message: 'RayChatOutput is not yet implemented for React Native',
    moduleName: 'RayChatOutput',
  });

  return <Text>RayChatOutput is not available for native mobile apps.</Text>;
};

export { RayChatOutput };
