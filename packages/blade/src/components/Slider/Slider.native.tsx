import React from 'react';
import type { SliderProps } from './types';
import { Text } from '~components/Typography';
import { throwBladeError } from '~utils/logger';

const Slider = (_props: SliderProps): React.ReactElement => {
  throwBladeError({
    message: 'Slider is not yet implemented for native',
    moduleName: 'Slider',
  });

  return <Text>Slider Component is not available for Native mobile apps.</Text>;
};

export { Slider };
