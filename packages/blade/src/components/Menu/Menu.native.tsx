import type { MenuProps } from './types';
import { Text } from '~components/Typography';
import { throwBladeError } from '~utils/logger';

const Menu = (_props: MenuProps): React.ReactElement => {
  throwBladeError({
    message: 'Menu is not yet implemented for native',
    moduleName: 'Menu',
  });

  return <Text>Menu Component is not available for Native mobile apps.</Text>;
};

export { Menu };
