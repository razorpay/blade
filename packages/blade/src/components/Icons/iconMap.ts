import CreditCardIconComponent from './CreditCardIcon';
import type { IconProps } from '.';

export const Icons: Record<string, React.FC<IconProps>> = {
  CreditCardIcon: CreditCardIconComponent,
};

export const IconNames = Object.keys(Icons);
