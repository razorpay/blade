import type { MorphProps } from './types';
import { Text } from '~components/Typography';
import { throwBladeError } from '~utils/logger';

const Morph = (_props: MorphProps): React.ReactElement => {
  throwBladeError({
    message: 'Morph is not yet implemented for native',
    moduleName: 'Morph',
  });

  return <Text>Morph Component is not available for Native mobile apps.</Text>;
};

export { Morph };
