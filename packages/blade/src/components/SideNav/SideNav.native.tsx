import { Text } from '~components/Typography';
import { throwBladeError } from '~utils/logger';

const SideNav = (): React.ReactElement => {
  throwBladeError({
    message: 'SideNav is not yet implemented for native',
    moduleName: 'SideNav',
  });

  return <Text>SideNav Component is not available for Native mobile apps.</Text>;
};

export { SideNav };
