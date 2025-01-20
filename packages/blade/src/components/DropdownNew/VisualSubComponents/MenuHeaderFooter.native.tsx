import type { DropdownHeaderProps, DropdownFooterProps } from '../types';
import { Text } from '~components/Typography';
import { throwBladeError } from '~utils/logger';

const DropdownHeader = (_props: DropdownHeaderProps): React.ReactElement => {
  throwBladeError({
    message: 'DropdownHeader is not yet implemented for native',
    moduleName: 'DropdownHeader',
  });

  return <Text>DropdownHeader Component is not available for Native mobile apps.</Text>;
};

const DropdownFooter = (_props: DropdownFooterProps): React.ReactElement => {
  throwBladeError({
    message: 'DropdownFooter is not yet implemented for native',
    moduleName: 'DropdownFooter',
  });

  return <Text>DropdownFooter Component is not available for Native mobile apps.</Text>;
};

export { DropdownHeader, DropdownFooter };
