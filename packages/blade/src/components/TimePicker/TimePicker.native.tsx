/* eslint-disable @typescript-eslint/no-explicit-any */
import { logger } from '~utils/logger';

const TimePicker = (_props: any): React.ReactElement => {
  logger({
    type: 'warn',
    message: 'TimePicker is not yet implemented for native',
    moduleName: 'TimePicker',
  });

  return <></>;
};

export { TimePicker };
