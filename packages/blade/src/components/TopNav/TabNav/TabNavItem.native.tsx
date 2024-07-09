import { Text } from '~components/Typography';
import { throwBladeError } from '~utils/logger';

const TabNavItem = (_props: never): React.ReactElement => {
  throwBladeError({
    message: 'TabNavItem is not yet implemented for native',
    moduleName: 'TabNavItem',
  });

  return <Text>TabNavItem Component is not available for Native mobile apps.</Text>;
};

export { TabNavItem };
