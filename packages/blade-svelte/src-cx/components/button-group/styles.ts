import type { AxisValue } from '../../axes';
import { BUTTON_AXES } from '../button/styles';
import type { ButtonStyleProps } from '../button/styles';

/** The blade taxonomy as data: the Button axes a group sets for all its buttons. */
export const BUTTON_GROUP_AXES = BUTTON_AXES;

type Axis<K extends keyof typeof BUTTON_GROUP_AXES> = AxisValue<typeof BUTTON_GROUP_AXES, K>;

/** Derived from BUTTON_GROUP_AXES: add a value there, never here. */
export interface ButtonGroupStyleProps {
  /** Every button's variant. @default 'primary' */
  variant?: Axis<'variant'>;
  /** Every button's size. @default 'medium' */
  size?: Axis<'size'>;
  /** Every button's colour. @default 'primary' */
  color?: Axis<'color'>;
}

export interface ButtonGroupClasses {
  root: string;
  /** What the group hands its Buttons. */
  button: Required<ButtonStyleProps>;
}

// Blade's ButtonGroup: buttons touching in a row, clipped to the group's
// radius (8px, 12px at large) through a 1px transparent border. Inner
// corners square off; the end buttons keep their outer corners, as Blade's
// do. Filled buttons are split by a 1px line (Blade's
// separator, here a 1px gap over the divider fill, as the children are one
// snippet); outlined ones overlap by 1px so their rims read as one line.
const ROOT =
  'inline-flex overflow-hidden border-thin border-solid border-transparent [background-clip:padding-box] [&_button]:rounded-none [&_a]:rounded-none';

const RADIUS: Record<Axis<'size'>, string> = {
  xsmall:
    'rounded-small [&>:first-child]:rounded-tl-small [&>:first-child]:rounded-bl-small [&>:last-child]:rounded-tr-small [&>:last-child]:rounded-br-small',
  small:
    'rounded-small [&>:first-child]:rounded-tl-small [&>:first-child]:rounded-bl-small [&>:last-child]:rounded-tr-small [&>:last-child]:rounded-br-small',
  medium:
    'rounded-small [&>:first-child]:rounded-tl-small [&>:first-child]:rounded-bl-small [&>:last-child]:rounded-tr-small [&>:last-child]:rounded-br-small',
  large:
    'rounded-medium [&>:first-child]:rounded-tl-medium [&>:first-child]:rounded-bl-medium [&>:last-child]:rounded-tr-medium [&>:last-child]:rounded-br-medium',
};

const JOIN: Record<'filled' | 'outlined', string> = {
  filled: 'gap-px bg-divider-gray-subtle',
  outlined: '[&>*+*]:-ml-px',
};

export function resolveButtonGroup(props: ButtonGroupStyleProps = {}): ButtonGroupClasses {
  const { variant = 'primary', size = 'medium', color = 'primary' } = props;
  const join = JOIN[variant === 'primary' ? 'filled' : 'outlined'];
  return {
    root: `${ROOT} ${RADIUS[size]} ${join}`,
    button: { variant, size, color },
  };
}
