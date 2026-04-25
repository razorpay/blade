import React from 'react';
import type { MetricsCardProps } from './types';
import { throwBladeError } from '~utils/logger';

const MetricsCard = (_props: MetricsCardProps): React.ReactElement => {
  throwBladeError({
    message: 'MetricsCard is not yet implemented for native',
    moduleName: 'MetricsCard',
  });

  return <></>;
};

export { MetricsCard };
