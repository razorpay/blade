import React from 'react';
/* eslint-disable react/jsx-no-useless-fragment */
import type { CounterInputProps } from './types';
import { Text } from '~components/Typography';
import { throwBladeError } from '~utils/logger';

const CounterInput = (_props: CounterInputProps): React.ReactElement => {
  throwBladeError({
    message: 'CounterInput is not yet implemented for native',
    moduleName: 'CounterInput',
  });

  return <Text>CounterInput Component is not available for Native mobile apps.</Text>;
};

export { CounterInput };
