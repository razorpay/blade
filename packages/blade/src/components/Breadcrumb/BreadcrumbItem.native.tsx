import type { BreadcrumbItemProps } from './types';
import { throwBladeError } from '~utils/logger';

const BreadcrumbItem = (_: BreadcrumbItemProps): React.ReactElement => {
  throwBladeError({
    message: 'BreadcrumbItem is not yet implemented for native',
    moduleName: 'BreadcrumbItem',
  });

  return <></>;
};

export { BreadcrumbItem };
