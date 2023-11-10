/* eslint-disable @typescript-eslint/no-explicit-any */
import { throwBladeError } from '~utils/logger';

const TourMask = (_: any): React.ReactElement => {
  throwBladeError({
    message: 'Tour is not yet implemented for native',
    moduleName: 'Tour',
  });

  return <></>;
};

export { TourMask };
