import { throwBladeError } from '~utils/logger';

const CountrySelector = (_props: never): React.ReactElement => {
  throwBladeError({
    message: 'CountrySelector is not yet implemented for native',
    moduleName: 'CountrySelector',
  });

  return <></>;
};

export { CountrySelector };
