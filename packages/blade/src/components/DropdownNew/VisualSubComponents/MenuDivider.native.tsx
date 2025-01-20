import type { StyledPropsBlade } from '~components/Box/styledProps';
import { Text } from '~components/Typography';
import { throwBladeError } from '~utils/logger';

const DropdownDivider = (_styledProps: StyledPropsBlade): React.ReactElement => {
  throwBladeError({
    message: 'DropdownDivider is not yet implemented for native',
    moduleName: 'DropdownDivider',
  });

  return <Text>DropdownDivider Component is not available for Native mobile apps.</Text>;
};

export { DropdownDivider };
