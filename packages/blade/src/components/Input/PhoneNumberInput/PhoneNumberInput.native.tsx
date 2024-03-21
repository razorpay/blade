import { throwBladeError } from '~utils/logger';

const PhoneNumberInput = (_props: never): React.ReactElement => {
  throwBladeError({
    message: 'PhoneNumberInput is not yet implemented for native',
    moduleName: 'PhoneNumberInput',
  });

  return <></>;
};

export { PhoneNumberInput };
