import type { AvatarGroupProps } from './types';
import { throwBladeError } from '~utils/logger';

const AvatarGroup = (_props: AvatarGroupProps): React.ReactElement => {
  throwBladeError({
    message: 'AvatarGroup is not yet implemented for React Native',
    moduleName: 'AvatarGroup',
  });

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <></>;
};

export { AvatarGroup };
