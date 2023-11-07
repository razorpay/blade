import type { TourStepProps } from './types';
import { throwBladeError } from '~utils/logger';

const TourStep = (_props: TourStepProps): React.ReactElement => {
  throwBladeError({
    message: 'TourStep is not yet implemented for native',
    moduleName: 'TourStep',
  });

  return <></>;
};

export { TourStep };
