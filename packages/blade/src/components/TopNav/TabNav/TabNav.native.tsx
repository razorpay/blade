import { Text } from '~components/Typography';
import { logger } from '~utils/logger';

const TabNav = (_props: never): React.ReactElement => {
  logger({
    type: 'warn',
    message: 'TabNav is not yet implemented for native',
    moduleName: 'TabNav',
  });

  return <Text>TabNav Component is not available for Native mobile apps.</Text>;
};

export { TabNav };
