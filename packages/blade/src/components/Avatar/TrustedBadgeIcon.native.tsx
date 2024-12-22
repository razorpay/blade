import { throwBladeError } from '~utils/logger';

import type { IconComponent } from '~components/Icons';

const TrustedBadgeIcon: IconComponent = () => {
  throwBladeError({
    message: 'TrustedBadgeIcon is not yet implemented for React Native',
    moduleName: 'TrustedBadgeIcon',
  });

  return <></>;
};

export { TrustedBadgeIcon };
