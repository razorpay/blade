import React from 'react';
import type { SliderProps } from './types';
import { Text } from '~components/Typography';
import { throwBladeError } from '~utils/logger';

const Slider = (_props: SliderProps): React.ReactElement => {
  throwBladeError({
    message: 'Slider is currently available on web only.',
    moduleName: 'Slider',
  });

  return <Text>Slider is not available for React Native.</Text>;
};

export { Slider };
