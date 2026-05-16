import { throwBladeError } from '~utils/logger';

import type { BaseFilterChipProps } from './types';

const BaseFilterChip = (_props: BaseFilterChipProps): React.ReactElement => {
  throwBladeError({
    message: 'BaseFilterChip is not yet implemented for native',
    moduleName: 'BaseFilterChip',
  });

  return <></>;
};

export { BaseFilterChip };
