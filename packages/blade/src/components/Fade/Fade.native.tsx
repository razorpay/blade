import type { FadeProps } from './types';
import { Text } from '~components/Typography';
import { throwBladeError } from '~utils/logger';

const Fade = (_props: FadeProps): React.ReactElement => {
  throwBladeError({
    message: 'Fade is not yet implemented for native',
    moduleName: 'Fade',
  });

  return <Text>Fade Component is not available for Native mobile apps.</Text>;
};

export { Fade };
