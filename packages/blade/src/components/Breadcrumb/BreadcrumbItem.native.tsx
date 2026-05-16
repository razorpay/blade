import { throwBladeError } from '~utils/logger';

import type { BreadcrumbItemProps } from './types';

const BreadcrumbItem = (_: BreadcrumbItemProps): React.ReactElement => {
  throwBladeError({
    message: 'BreadcrumbItem is not yet implemented for native',
    moduleName: 'BreadcrumbItem',
  });

  return <></>;
};

export { BreadcrumbItem };
