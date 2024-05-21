import { Text } from '~components/Typography';
import { throwBladeError } from '~utils/logger';

const SideNavBody = (): React.ReactElement => {
  throwBladeError({
    message: 'SideNavBody is not yet implemented for native',
    moduleName: 'SideNavBody',
  });

  return <Text>SideNavBody Component is not available for Native mobile apps.</Text>;
};

export { SideNavBody };
