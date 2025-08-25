import React from 'react';
/* eslint-disable react/jsx-no-useless-fragment */
import type { EmptyStateProps } from './types';
import { Text } from '~components/Typography';
import { throwBladeError } from '~utils/logger';

const EmptyState = (_props: EmptyStateProps): React.ReactElement => {
  throwBladeError({
    message: 'EmptyState is not yet implemented for native',
    moduleName: 'EmptyState',
  });

  return <Text>EmptyState Component is not available for Native mobile apps.</Text>;
};

export { EmptyState };
