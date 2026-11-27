import type { RazorSenseBackgroundProps } from './types';
import { throwBladeError } from '~utils/logger';
import { Text } from '~components/Typography';

const RazorSenseBackground = (_props: RazorSenseBackgroundProps): React.ReactElement => {
  throwBladeError({
    message: 'RazorSenseBackground is not yet implemented for React Native',
    moduleName: 'RazorSenseBackground',
  });

  return <Text>RazorSenseBackground is not available for Native mobile apps.</Text>;
};

export { RazorSenseBackground };
