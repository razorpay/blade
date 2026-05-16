import { throwBladeError } from '~utils/logger';

import type { BreadcrumbProps } from './types';

const Breadcrumb = (_: BreadcrumbProps): React.ReactElement => {
  throwBladeError({
    message: 'Breadcrumb is not yet implemented for native',
    moduleName: 'Breadcrumb',
  });

  return <></>;
};

export { Breadcrumb };
