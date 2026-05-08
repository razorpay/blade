import type { MenuOverlayProps } from './types';
import { Text } from '~components/Typography';
import { logger } from '~utils/logger';

const MenuOverlay = (_props: MenuOverlayProps): React.ReactElement => {
  logger({
    type: 'warn',
    message: 'MenuOverlay is not yet implemented for native',
    moduleName: 'MenuOverlay',
  });

  return <Text>MenuOverlay Component is not available for Native mobile apps.</Text>;
};

export { MenuOverlay };
