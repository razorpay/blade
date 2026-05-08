import type { MorphProps } from './types';
import { Text } from '~components/Typography';
import { logger } from '~utils/logger';

const Morph = (_props: MorphProps): React.ReactElement => {
  logger({ type: 'warn', message: 'Morph is not yet implemented for native', moduleName: 'Morph' });

  return <Text>Morph Component is not available for Native mobile apps.</Text>;
};

export { Morph };
