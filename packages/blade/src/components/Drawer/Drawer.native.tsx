import { Text } from '~components/Typography';
import { throwBladeError } from '~utils/logger';

import type { DrawerProps } from './types';

const Drawer = (_props: DrawerProps): React.ReactElement => {
  throwBladeError({
    message: 'Drawer is not yet implemented for native',
    moduleName: 'Drawer',
  });

  return <Text>Drawer Component is not available for Native mobile apps.</Text>;
};

export { Drawer };
