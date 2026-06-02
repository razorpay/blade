import { throwBladeError } from '~utils/logger';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Slider = (): any => {
  throwBladeError({
    message: 'Slider is not yet supported on React Native.',
    moduleName: 'Slider',
  });
};

export { Slider };
