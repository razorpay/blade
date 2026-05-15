/* eslint-disable react/jsx-no-useless-fragment */
import { throwBladeError } from '~utils/logger';

import type { SpotlightPopoverTourProps } from './types';

const Tour = (_props: SpotlightPopoverTourProps): React.ReactElement => {
  throwBladeError({
    message: 'Tour is not yet implemented for native',
    moduleName: 'Tour',
  });

  return <></>;
};

export { Tour };
