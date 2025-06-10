import React from 'react';
/* eslint-disable react/jsx-no-useless-fragment */
import type { InputGroupProps } from './types';
import { Text } from '~components/Typography';
import { throwBladeError } from '~utils/logger';

const InputGroup = (_props: InputGroupProps): React.ReactElement => {
  throwBladeError({
    message: 'InputGroup is not yet implemented for native',
    moduleName: 'InputGroup',
  });

  return <Text>InputGroup Component is not available for Native mobile apps.</Text>;
};

export { InputGroup };
