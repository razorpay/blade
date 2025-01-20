import type { DropdownOverlayProps } from './types';
import { Text } from '~components/Typography';
import { throwBladeError } from '~utils/logger';

const DropdownOverlay = (_props: DropdownOverlayProps): React.ReactElement => {
  throwBladeError({
    message: 'DropdownOverlay is not yet implemented for native',
    moduleName: 'DropdownOverlay',
  });

  return <Text>DropdownOverlay Component is not available for Native mobile apps.</Text>;
};

export { DropdownOverlay };
