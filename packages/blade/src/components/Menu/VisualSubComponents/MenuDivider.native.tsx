import type { StyledPropsBlade } from '~components/Box/styledProps';
import { Text } from '~components/Typography';
import { throwBladeError } from '~utils/logger';

const MenuDivider = (_styledProps: StyledPropsBlade): React.ReactElement => {
  throwBladeError({
    message: 'MenuDivider is not yet implemented for native',
    moduleName: 'MenuDivider',
  });

  return <Text>MenuDivider Component is not available for Native mobile apps.</Text>;
};

export { MenuDivider };
