import type { BottomNavProps, BottomNavItemProps } from './types';
import { Text } from '~components/Typography';
import { throwBladeError } from '~utils/logger';

const BottomNav = (_props: BottomNavProps): React.ReactElement => {
  throwBladeError({
    message: 'BottomNav is not yet implemented for native',
    moduleName: 'BottomNav',
  });

  return <Text>BottomNav Component is not available for Native mobile apps.</Text>;
};

const BottomNavItem = (_props: BottomNavItemProps): React.ReactElement => {
  throwBladeError({
    message: 'BottomNavItem is not yet implemented for native',
    moduleName: 'BottomNavItem',
  });

  return <Text>BottomNav Component is not available for Native mobile apps.</Text>;
};

export { BottomNav, BottomNavItem };
