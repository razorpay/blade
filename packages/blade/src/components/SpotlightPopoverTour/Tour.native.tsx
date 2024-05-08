/* eslint-disable react/jsx-no-useless-fragment */
import type { SpotlightPopoverTourProps } from './types';
import { throwBladeError } from '~utils/logger';

const Tour = (_props: SpotlightPopoverTourProps): React.ReactElement => {
  throwBladeError({
    message: 'Tour is not yet implemented for native',
    moduleName: 'Tour',
  });

  return <></>;
};

export { Tour };
