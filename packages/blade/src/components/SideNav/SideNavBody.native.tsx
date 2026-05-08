import type { SideNavBodyProps } from './types';
import { Text } from '~components/Typography';
import { logger } from '~utils/logger';

const SideNavBody = (_props: SideNavBodyProps): React.ReactElement => {
  logger({
    type: 'warn',
    message: 'SideNavBody is not yet implemented for native',
    moduleName: 'SideNavBody',
  });

  return <Text>SideNavBody Component is not available for Native mobile apps.</Text>;
};

export { SideNavBody };
