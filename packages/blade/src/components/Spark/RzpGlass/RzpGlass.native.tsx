import { throwBladeError } from '~utils/logger';
import type { RzpGlassProps } from './types';
import { Text } from '~components/Typography';

const RzpGlass = (_props: RzpGlassProps): React.ReactElement => {
  throwBladeError({
    message: 'RazorSense is not yet implemented for React Native',
    moduleName: 'RazorSense',
  });

  return <Text>RazorSense Component is not available for Native mobile apps.</Text>;
};

export { RzpGlass };
