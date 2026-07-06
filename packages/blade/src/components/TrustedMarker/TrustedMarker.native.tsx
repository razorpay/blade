import React from 'react';
import type { TrustedMarkerProps } from './types';
import { Text } from '~components/Typography';
import { throwBladeError } from '~utils/logger';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { MetaConstants } from '~utils/metaAttribute';

const _TrustedMarker = (_props: TrustedMarkerProps): React.ReactElement => {
  throwBladeError({
    message: 'TrustedMarker is not yet implemented for native',
    moduleName: 'TrustedMarker',
  });

  return <Text>TrustedMarker Component is not available for Native mobile apps.</Text>;
};

const TrustedMarker = assignWithoutSideEffects(_TrustedMarker, {
  componentId: MetaConstants.TrustedMarker,
});

export { TrustedMarker };
