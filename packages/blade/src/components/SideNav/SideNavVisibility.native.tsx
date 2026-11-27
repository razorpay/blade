import type { SideNavVisibilityProps } from './types';
import { Text } from '~components/Typography';
import { throwBladeError } from '~utils/logger';

const SideNavVisibility = (_props: SideNavVisibilityProps): React.ReactElement => {
  throwBladeError({
    message: 'SideNavVisibility is not yet implemented for native',
    moduleName: 'SideNavVisibility',
  });

  return <Text>SideNavVisibility Component is not available for Native mobile apps.</Text>;
};

export { SideNavVisibility };
