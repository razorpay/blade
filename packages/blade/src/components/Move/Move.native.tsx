import { Text } from '~components/Typography';
import { throwBladeError } from '~utils/logger';
import type { MoveProps } from './types';

const Move = (_props: MoveProps): React.ReactElement => {
  throwBladeError({
    message: 'Move is not yet implemented for native',
    moduleName: 'Move',
  });

  return <Text>Move Component is not available for Native mobile apps.</Text>;
};

export { Move };
