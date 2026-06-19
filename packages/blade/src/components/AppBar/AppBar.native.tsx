import React from 'react';
import type { AppBarActionsProps, AppBarLeadingProps, AppBarProps } from './types';
import { Text } from '~components/Typography';
import { throwBladeError } from '~utils/logger';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { MetaConstants } from '~utils/metaAttribute';

const _AppBar = (_props: AppBarProps): React.ReactElement => {
  throwBladeError({
    message: 'AppBar is not yet implemented for native',
    moduleName: 'AppBar',
  });

  return <Text>AppBar Component is not available for Native mobile apps.</Text>;
};

const AppBar = assignWithoutSideEffects(_AppBar, { componentId: MetaConstants.AppBar });

const _AppBarLeading = (_props: AppBarLeadingProps): React.ReactElement => {
  return <Text>AppBarLeading Component is not available for Native mobile apps.</Text>;
};

const AppBarLeading = assignWithoutSideEffects(_AppBarLeading, {
  componentId: MetaConstants.AppBarLeading,
});

const _AppBarActions = (_props: AppBarActionsProps): React.ReactElement => {
  return <Text>AppBarActions Component is not available for Native mobile apps.</Text>;
};

const AppBarActions = assignWithoutSideEffects(_AppBarActions, {
  componentId: MetaConstants.AppBarActions,
});

export { AppBar, AppBarLeading, AppBarActions };
