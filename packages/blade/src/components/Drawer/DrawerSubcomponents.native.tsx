import React from 'react';
import type { DrawerHeaderProps, DrawerFooterProps } from './types';
import { Text } from '~components/Typography';
import { throwBladeError } from '~utils/logger';

const DrawerHeader = (_props: DrawerHeaderProps): React.ReactElement => {
  throwBladeError({
    message: 'DrawerHeader is not yet implemented for native',
    moduleName: 'DrawerHeader',
  });

  return <Text>Drawer Component is not available for Native mobile apps.</Text>;
};

const DrawerBody = (_props: { children: React.ReactNode }): React.ReactElement => {
  throwBladeError({
    message: 'DrawerBody is not yet implemented for native',
    moduleName: 'DrawerBody',
  });

  return <Text>Drawer Component is not available for Native mobile apps.</Text>;
};

const DrawerFooter = (_props: DrawerFooterProps): React.ReactElement => {
  throwBladeError({
    message: 'DrawerFooter is not yet implemented for native',
    moduleName: 'DrawerFooter',
  });

  return <Text>Drawer Component is not available for Native mobile apps.</Text>;
};

export { DrawerHeader, DrawerBody, DrawerFooter };
