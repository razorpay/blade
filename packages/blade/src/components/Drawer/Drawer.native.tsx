import type { DrawerProps } from './types';
import { Text } from '~components/Typography';
import { logger } from '~utils/logger';

const Drawer = (_props: DrawerProps): React.ReactElement => {
  if (__DEV__) {
    logger({
      type: 'warn',
      moduleName: 'Drawer',
      message: 'Drawer Component is not available for Native mobile apps.',
    });
  }
  return <Text>Drawer Component is not available for Native mobile apps.</Text>;
};

export { Drawer };
