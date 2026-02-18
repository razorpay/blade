import { Text } from '~components/Typography';
import { throwBladeError } from '~utils/logger';

const ProgressiveBlurEffect = (_props: never): React.ReactElement => {
  throwBladeError({
    message: 'ProgressiveBlurEffect is not yet implemented for native',
    moduleName: 'ProgressiveBlurEffect',
  });

  return <Text>ProgressiveBlurEffect Component is not available for Native mobile apps.</Text>;
};

export { ProgressiveBlurEffect };
