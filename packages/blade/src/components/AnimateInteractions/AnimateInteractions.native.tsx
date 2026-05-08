import type { AnimateInteractionsProps } from './types';
import { Text } from '~components/Typography';
import { logger } from '~utils/logger';

const AnimateInteractions = (_props: AnimateInteractionsProps): React.ReactElement => {
  logger({
    type: 'warn',
    message: 'AnimateInteractions is not yet implemented for native',
    moduleName: 'AnimateInteractions',
  });

  return <Text>AnimateInteractions Component is not available for Native mobile apps.</Text>;
};

export { AnimateInteractions };
