import React from 'react';
import { Text } from '~components/Typography';
import { throwBladeError } from '~utils/logger';

const SettingCard = (): React.ReactElement => {
  throwBladeError({
    message: ' not yet implemented for native',
    moduleName: 'SettingsCard',
  });

  return <Text>SettingsCard is not available for Native mobile apps.</Text>;
};

export { SettingCard };
