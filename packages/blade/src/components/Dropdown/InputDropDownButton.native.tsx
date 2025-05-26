/* eslint-disable @typescript-eslint/no-explicit-any */
import { throwBladeError } from '~utils/logger';

const InputDropDownButton = (_props: any): React.ReactElement => {
  throwBladeError({
    message: 'InputDropDownButton is not yet implemented for native',
    moduleName: 'InputDropDownButton',
  });

  return <></>;
};

export { InputDropDownButton };
