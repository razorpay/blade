import type { TourProps } from './types';
import { throwBladeError } from '~utils/logger';

const Tour = (_props: TourProps): React.ReactElement => {
  throwBladeError({
    message: 'Tour is not yet implemented for native',
    moduleName: 'Tour',
  });

  return <></>;
};

export { Tour };
