import { throwBladeError } from '~utils/logger';

import type { IconComponent } from '~components/Icons';

const TrustedBadge: IconComponent = () => {
  throwBladeError({
    message: 'Truste is not yet implemented for React Native',
    moduleName: 'Truste',
  });

  return <></>;
};

export { TrustedBadge };
