import CreditCardIconComponent from './CreditCardIcon';
import RupeeIconComponent from './RupeeIcon';
import type { IconProps } from '.';

// add new icons here to make them visible in storybook
const iconMap: Record<string, React.ComponentType<IconProps>> = {
  CreditCardIcon: CreditCardIconComponent,
  RupeeIcon: RupeeIconComponent,
};

export default iconMap;
