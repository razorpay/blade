import { Text } from '~components/Typography';
import { throwBladeError } from '~utils/logger';
import type { AnimateInteractionsProps } from './types';

const AnimateInteractions = (_props: AnimateInteractionsProps): React.ReactElement => {
  throwBladeError({
    message: 'AnimateInteractions is not yet implemented for native',
    moduleName: 'AnimateInteractions',
  });

  return <Text>AnimateInteractions Component is not available for Native mobile apps.</Text>;
};

export { AnimateInteractions };