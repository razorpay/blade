import { throwBladeError } from '~utils/logger';
import { Text } from '~components/Typography';

import type { IconComponent } from '~components/Icons';

const TrustedBadgeIcon: IconComponent = () => {
  throwBladeError({
    message: 'TrustedBadgeIcon is not yet implemented for React Native',
    moduleName: 'TrustedBadgeIcon',
  });

  return <Text>TrustedBadgeIcon is not available for Native mobile apps.</Text>;
};

export { TrustedBadgeIcon };
