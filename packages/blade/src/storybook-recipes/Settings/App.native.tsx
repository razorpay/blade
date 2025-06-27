import React from 'react';
import { Text } from '~components/Typography';
import { throwBladeError } from '~utils/logger';

const App = (): React.ReactElement => {
  throwBladeError({
    message: ' not yet implemented for native',
    moduleName: 'Settings Example',
  });

  return <Text>Settings Example is not available for Native mobile apps.</Text>;
};

export { App };
