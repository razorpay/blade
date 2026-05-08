import type { MenuHeaderProps, MenuFooterProps } from '../types';
import { Text } from '~components/Typography';
import { logger } from '~utils/logger';

const MenuHeader = (_props: MenuHeaderProps): React.ReactElement => {
  logger({
    type: 'warn',
    message: 'MenuHeader is not yet implemented for native',
    moduleName: 'MenuHeader',
  });

  return <Text>MenuHeader Component is not available for Native mobile apps.</Text>;
};

const MenuFooter = (_props: MenuFooterProps): React.ReactElement => {
  logger({
    type: 'warn',
    message: 'MenuFooter is not yet implemented for native',
    moduleName: 'MenuFooter',
  });

  return <Text>MenuFooter Component is not available for Native mobile apps.</Text>;
};

export { MenuHeader, MenuFooter };
