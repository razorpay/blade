/* eslint-disable @typescript-eslint/no-explicit-any */
import { throwBladeError } from '~utils/logger';

const InputDropdownButton = (_props: any): React.ReactElement => {
  throwBladeError({
    message: 'InputDropdownButton is not yet implemented for native',
    moduleName: 'InputDropdownButton',
  });

  return <></>;
};

export { InputDropdownButton };
