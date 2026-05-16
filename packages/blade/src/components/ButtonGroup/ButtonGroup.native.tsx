import { throwBladeError } from '~utils/logger';

import type { ButtonGroupProps } from './types';

const ButtonGroup = (_props: ButtonGroupProps): React.ReactElement => {
  throwBladeError({
    message: 'ButtonGroup is not yet implemented for React Native',
    moduleName: 'ButtonGroup',
  });

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <></>;
};

export { ButtonGroup };
