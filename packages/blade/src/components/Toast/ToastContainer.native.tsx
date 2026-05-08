import { logger } from '~utils/logger';

const ToastContainer = (): React.ReactElement => {
  logger({
    type: 'warn',
    message: 'ToastContainer is not yet implemented for native',
    moduleName: 'ToastContainer',
  });

  return <></>;
};

export { ToastContainer };
