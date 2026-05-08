import type { ToastProps } from './types';
import { logger } from '~utils/logger';

const Toast = (
  _props: ToastProps & {
    isVisible?: boolean;
  },
): React.ReactElement => {
  logger({ type: 'warn', message: 'Toast is not yet implemented for native', moduleName: 'Toast' });

  return <></>;
};

export { Toast };
