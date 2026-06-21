import React from 'react';
import { Text } from '~components/Typography';
import { throwBladeError } from '~utils/logger';

const BouncyLoader = (_prop: any): React.ReactElement => {
  throwBladeError({
    message: 'BouncyLoader is not yet implemented for native',
    moduleName: 'BouncyLoader',
  });

  return <Text>BouncyLoader is not available for Native mobile apps.</Text>;
};

export { BouncyLoader };
