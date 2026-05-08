import type { SideNavItemProps } from '../types';
import { Text } from '~components/Typography';
import { logger } from '~utils/logger';

const SideNavItem = (_props: SideNavItemProps): React.ReactElement => {
  logger({
    type: 'warn',
    message: 'SideNavItem is not yet implemented for native',
    moduleName: 'SideNavItem',
  });

  return <Text>SideNavItem Component is not available for Native mobile apps.</Text>;
};

export { SideNavItem };
