import type { DrawerProps } from './types';
import { Text } from '~components/Typography';
import { logger } from '~utils/logger';

const Drawer = (_props: DrawerProps): React.ReactElement => {
  logger({
    type: 'warn',
    message: 'Drawer is not yet implemented for native',
    moduleName: 'Drawer',
  });

  return <Text>Drawer Component is not available for Native mobile apps.</Text>;
};

export { Drawer };
