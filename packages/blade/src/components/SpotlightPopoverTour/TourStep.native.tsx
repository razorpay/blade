/* eslint-disable react/jsx-no-useless-fragment */
import { throwBladeError } from '~utils/logger';

import type { SpotlightPopoverTourStepProps } from './types';

const SpotlightPopoverTourStep = (_props: SpotlightPopoverTourStepProps): React.ReactElement => {
  throwBladeError({
    message: 'TourStep is not yet implemented for native',
    moduleName: 'TourStep',
  });

  return <></>;
};

export { SpotlightPopoverTourStep };
