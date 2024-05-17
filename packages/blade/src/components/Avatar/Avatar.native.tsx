import type { AvatarProps } from './types';
import { throwBladeError } from '~utils/logger';

const Avatar = (_props: AvatarProps): React.ReactElement => {
  throwBladeError({
    message: 'Avatar is not yet implemented for React Native',
    moduleName: 'Avatar',
  });

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <></>;
};

export { Avatar };
