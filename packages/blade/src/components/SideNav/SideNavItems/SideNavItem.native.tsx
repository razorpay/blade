import type { SideNavItemProps } from '../types';
import { Text } from '~components/Typography';
import { throwBladeError } from '~utils/logger';

const SideNavItem = (_props: SideNavItemProps): React.ReactElement => {
  throwBladeError({
    message: 'SideNavItem is not yet implemented for native',
    moduleName: 'SideNavItem',
  });

  return <Text>SideNavItem Component is not available for Native mobile apps.</Text>;
};

export { SideNavItem };
