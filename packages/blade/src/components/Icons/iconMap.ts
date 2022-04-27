import CreditCardIconComponent from './CreditCardIcon';
import RupeeIconComponent from './RupeeIcon';
import type { IconProps } from '.';

// add new icons here to make them visible in storybook
export const Icons: Record<string, React.ComponentType<IconProps>> = {
  CreditCardIcon: CreditCardIconComponent,
  RupeeIcon: RupeeIconComponent,
};

export const IconNames = Object.keys(Icons);
