import React from 'react';
import type { TrustBadgeProps } from './types';
import { Text } from '~components/Typography';
import { throwBladeError } from '~utils/logger';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { MetaConstants } from '~utils/metaAttribute';

const _TrustBadge = (_props: TrustBadgeProps): React.ReactElement => {
  throwBladeError({
    message: 'TrustBadge is not yet implemented for native',
    moduleName: 'TrustBadge',
  });

  return <Text>TrustBadge Component is not available for Native mobile apps.</Text>;
};

const TrustBadge = assignWithoutSideEffects(_TrustBadge, {
  componentId: MetaConstants.TrustBadge,
});

export { TrustBadge };
