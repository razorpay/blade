import { throwBladeError } from '~utils/logger';

import type { IconComponent } from '~components/Icons';

const TrustedBadge: IconComponent = () => {
  throwBladeError({
    message: 'TrustedBadge is not yet implemented for React Native',
    moduleName: 'TrustedBadge',
  });

  return <></>;
};

export { TrustedBadge };
