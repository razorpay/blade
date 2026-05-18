import { throwBladeError } from '~utils/logger';
import type { FluidGradientProps } from './FluidGradient';
import { Text } from '~components/Typography';

const FluidGradient = (_props: FluidGradientProps): React.ReactElement => {
  throwBladeError({
    message: 'RazorSenseGradient is not yet implemented for React Native',
    moduleName: 'RazorSenseGradient',
  });

  return <Text>RazorSenseGradient Component is not available for Native mobile apps.</Text>;
};

export { FluidGradient };
