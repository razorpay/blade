import React from 'react';
/* eslint-disable react/jsx-no-useless-fragment */
import type { InputRowProps } from './types';
import { Text } from '~components/Typography';
import { throwBladeError } from '~utils/logger';

const InputRow = (_props: InputRowProps): React.ReactElement => {
  throwBladeError({
    message: 'InputRow is not yet implemented for native',
    moduleName: 'InputRow',
  });

  return <Text>InputRow Component is not available for Native mobile apps.</Text>;
};

export { InputRow };
