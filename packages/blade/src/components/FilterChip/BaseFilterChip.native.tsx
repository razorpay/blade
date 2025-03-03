import { throwBladeError } from '~utils/logger';

const BaseFilterChip = (_props: any): React.ReactElement => {
  throwBladeError({
    message: 'BaseFilterChip is not yet implemented for native',
    moduleName: 'BaseFilterChip',
  });

  return <></>;
};

export { BaseFilterChip };
