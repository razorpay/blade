import React from 'react';
import type { ListViewProps } from './types';
import { Text } from '~components/Typography';
import { logger } from '~utils/logger';

const ListView = (_prop: ListViewProps): React.ReactElement => {
  logger({
    type: 'warn',
    message: 'ListView is not yet implemented for native',
    moduleName: 'ListView',
  });

  return <Text>ListView is not available for Native mobile apps.</Text>;
};

export { ListView };
