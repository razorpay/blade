import type { MenuItemProps } from './types';
import { Text } from '~components/Typography';
import { throwBladeError } from '~utils/logger';

const MenuItem = (_props: MenuItemProps): React.ReactElement => {
  throwBladeError({
    message: 'MenuItem is not yet implemented for native',
    moduleName: 'MenuItem',
  });

  return <Text>MenuItem Component is not available for Native mobile apps.</Text>;
};

export { MenuItem };
