/* eslint-disable @typescript-eslint/no-explicit-any */
import { logger } from '~utils/logger';

const DatePicker = (_props: any): React.ReactElement => {
  logger({
    type: 'warn',
    message: 'DatePicker is not yet implemented for native',
    moduleName: 'DatePicker',
  });

  return <></>;
};

export { DatePicker };
