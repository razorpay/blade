import type { ToastProps } from './types';
import { throwBladeError } from '~utils/logger';

const Toast = (
  _props: ToastProps & {
    isVisible?: boolean;
  },
): React.ReactElement => {
  throwBladeError({
    message: 'Toast is not yet implemented for native',
    moduleName: 'Toast',
  });

  return <></>;
};

export { Toast };
