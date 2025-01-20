import type { DropdownProps } from './types';
import { Text } from '~components/Typography';
import { throwBladeError } from '~utils/logger';

const Dropdown = (_props: DropdownProps): React.ReactElement => {
  throwBladeError({
    message: 'Dropdown is not yet implemented for native',
    moduleName: 'Dropdown',
  });

  return <Text>Dropdown Component is not available for Native mobile apps.</Text>;
};

export { Dropdown };
