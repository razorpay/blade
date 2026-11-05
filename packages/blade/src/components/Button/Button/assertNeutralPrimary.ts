import type { ButtonProps } from './Button';
import { throwBladeError } from '~utils/logger';

/**
 * `color="neutral"` is a primary button only (as BaseButton's tertiary colours): Button and DropdownButton check it with the
 * colour and variant they render (a ButtonGroup's win). BaseButton's own neutral secondary / tertiary styles stay internal.
 */
const assertNeutralPrimary = ({
  color,
  variant,
  moduleName,
}: {
  color: ButtonProps['color'];
  variant: ButtonProps['variant'];
  moduleName: string;
}): void => {
  if (color === 'neutral' && variant !== 'primary') {
    throwBladeError({
      moduleName,
      message: `color "neutral" can only be used with variant "primary" but received "${variant}"`,
    });
  }
};

export { assertNeutralPrimary };
