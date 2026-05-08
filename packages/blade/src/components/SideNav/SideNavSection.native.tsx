import type { SideNavSectionProps } from './types';
import { Text } from '~components/Typography';
import { logger } from '~utils/logger';

const SideNavSection = (_props: SideNavSectionProps): React.ReactElement => {
  logger({
    type: 'warn',
    message: 'SideNavSection is not yet implemented for native',
    moduleName: 'SideNavSection',
  });

  return <Text>SideNavSection Component is not available for Native mobile apps.</Text>;
};

export { SideNavSection };
