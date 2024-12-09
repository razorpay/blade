import type { FadeProps } from './types';
import type { BaseMotionEntryExitProps } from '~components/BaseMotion';
import { Text } from '~components/Typography';
import { throwBladeError } from '~utils/logger';
import type { FadeProps } from './types';

const Fade = (_props: FadeProps): React.ReactElement => {
  throwBladeError({
    message: 'Fade is not yet implemented for native',
    moduleName: 'Fade',
  });

  return <Text>Fade Component is not available for Native mobile apps.</Text>;
};

export { Fade };
export type { BaseMotionEntryExitProps as FadeProps };
