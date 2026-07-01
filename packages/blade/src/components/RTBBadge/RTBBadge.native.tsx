import React from 'react';
import type { RTBBadgeProps } from './types';
import { Text } from '~components/Typography';
import { throwBladeError } from '~utils/logger';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { MetaConstants } from '~utils/metaAttribute';

const _RTBBadge = (_props: RTBBadgeProps): React.ReactElement => {
  throwBladeError({
    message: 'RTBBadge is not yet implemented for native',
    moduleName: 'RTBBadge',
  });

  return <Text>RTBBadge Component is not available for Native mobile apps.</Text>;
};

const RTBBadge = assignWithoutSideEffects(_RTBBadge, {
  componentId: MetaConstants.RTBBadge,
});

export { RTBBadge };
