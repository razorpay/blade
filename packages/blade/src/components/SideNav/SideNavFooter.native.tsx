import { Text } from '~components/Typography';
import { throwBladeError } from '~utils/logger';

import type { SideNavFooterProps } from './types';

const SideNavFooter = (_props: SideNavFooterProps): React.ReactElement => {
  throwBladeError({
    message: 'SideNavFooter is not yet implemented for native',
    moduleName: 'SideNavFooter',
  });

  return <Text>SideNavFooter Component is not available for Native mobile apps.</Text>;
};

export { SideNavFooter };
