import type { RazorSenseBottomWaveProps } from './types';
import { throwBladeError } from '~utils/logger';
import { Text } from '~components/Typography';

const RazorSenseBottomWave = (_props: RazorSenseBottomWaveProps): React.ReactElement => {
  throwBladeError({
    message: 'RazorSenseBottomWave is not yet implemented for React Native',
    moduleName: 'RazorSenseBottomWave',
  });

  return <Text>RazorSenseBottomWave is not available for Native mobile apps.</Text>;
};

export { RazorSenseBottomWave };
