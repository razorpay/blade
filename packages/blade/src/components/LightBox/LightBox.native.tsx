/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import type { LightBoxProps } from './types';
import { logger } from '~utils/logger';
import { Text } from '~components/Typography';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _LightBox = (props: LightBoxProps): React.ReactElement => {
  if (__DEV__) {
    logger({
      type: 'warn',
      moduleName: 'LightBox',
      message:
        'LightBox is not supported on mobile devices. Please use a different approach for native.',
    });
  }

  return <Text>LightBox Component is not available for Native mobile apps.</Text>;
};

const LightBox = assignWithoutSideEffects(_LightBox, {
  displayName: 'LightBox',
});

export { LightBox };
