import type { RazorSenseSuccessProps } from './types';
import { throwBladeError } from '~utils/logger';
import { Text } from '~components/Typography';

const RazorSenseSuccess = (_props: RazorSenseSuccessProps): React.ReactElement => {
  throwBladeError({
    message: 'RazorSenseSuccess is not yet implemented for React Native',
    moduleName: 'RazorSenseSuccess',
  });

  return <Text>RazorSenseSuccess is not available for Native mobile apps.</Text>;
};

export { RazorSenseSuccess };
