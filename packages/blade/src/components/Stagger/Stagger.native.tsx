import type { StaggerProps } from './types';
import { Text } from '~components/Typography';
import { throwBladeError } from '~utils/logger';

const Stagger = (_props: StaggerProps): React.ReactElement => {
  throwBladeError({
    message: 'Stagger is not yet implemented for native',
    moduleName: 'Stagger',
  });

  return <Text>Stagger Component is not available for Native mobile apps.</Text>;
};

export { Stagger };
