/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { throwBladeError } from '~utils/logger';

const TourFooter = (): React.ReactElement => {
  throwBladeError({
    message: 'Tour is not yet implemented for native',
    moduleName: 'Tour',
  });

  return <></>;
};

export { TourFooter };
