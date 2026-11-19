import type { ButtonGroupProps } from './types';
import { throwBladeError } from '~utils/logger';

const supportedColors: NonNullable<ButtonGroupProps['color']>[] = [
  'primary',
  'white',
  'positive',
  'negative',
];

/**
 * The `color` type only allows the supported colors, but plain JavaScript or a cast can still
 * pass another `Button` color, such as `neutral`. Shared by the web and native ButtonGroup.
 */
const verifyButtonGroupColor = (color: ButtonGroupProps['color']): void => {
  if (color && !supportedColors.includes(color)) {
    throwBladeError({
      moduleName: 'ButtonGroup',
      message: `"${color}" color is not supported on ButtonGroup`,
    });
  }
};

export { verifyButtonGroupColor };
