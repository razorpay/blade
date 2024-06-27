import type { MenuOverlayProps } from './types';
import { Text } from '~components/Typography';
import { throwBladeError } from '~utils/logger';

const MenuOverlay = (_props: MenuOverlayProps): React.ReactElement => {
  throwBladeError({
    message: 'MenuOverlay is not yet implemented for native',
    moduleName: 'MenuOverlay',
  });

  return <Text>MenuOverlay Component is not available for Native mobile apps.</Text>;
};

export { MenuOverlay };
