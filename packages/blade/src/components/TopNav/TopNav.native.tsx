import { Text } from '~components/Typography';
import { throwBladeError } from '~utils/logger';

const TopNav = (_props: never): React.ReactElement => {
  throwBladeError({
    message: 'TopNav is not yet implemented for native',
    moduleName: 'TopNav',
  });

  return <Text>TopNav Component is not available for Native mobile apps.</Text>;
};

export { TopNav };
