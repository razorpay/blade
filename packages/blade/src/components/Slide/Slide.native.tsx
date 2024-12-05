import type { SlideProps } from './types';
import { Text } from '~components/Typography';
import { throwBladeError } from '~utils/logger';

const Slide = (_props: SlideProps): React.ReactElement => {
  throwBladeError({
    message: 'Slide is not yet implemented for native',
    moduleName: 'Slide',
  });

  return <Text>Slide Component is not available for Native mobile apps.</Text>;
};

export { Slide };
