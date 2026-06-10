import React from 'react';
import type { SliderInputProps } from './types';
import { Text } from '~components/Typography';
import { throwBladeError } from '~utils/logger';

const SliderInput = (_props: SliderInputProps): React.ReactElement => {
  throwBladeError({
    message: 'SliderInput is not yet implemented for native',
    moduleName: 'SliderInput',
  });

  return <Text>SliderInput Component is not available for Native mobile apps.</Text>;
};

export { SliderInput };
