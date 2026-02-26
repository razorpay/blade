/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import type { LightBoxBodyProps } from './types';
import { Text } from '~components/Typography';

const LightBoxBody = (_props: LightBoxBodyProps): React.ReactElement => {
  return (
    <Text>
      LightBoxBody Component is not available for Native mobile apps.
    </Text>
  );
};

LightBoxBody.displayName = 'LightBoxBody';

export { LightBoxBody };
