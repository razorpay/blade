import type { BreadcrumbProps } from './types';
import { throwBladeError } from '~utils/logger';

const Breadcrumb = (_: BreadcrumbProps): React.ReactElement => {
  throwBladeError({
    message: 'Breadcrumb is not yet implemented for native',
    moduleName: 'Breadcrumb',
  });

  return <></>;
};

export { Breadcrumb };
