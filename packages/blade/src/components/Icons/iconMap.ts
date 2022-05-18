import CreditCardIconComponent from './CreditCardIcon';
import DollarIconComponent from './DollarIcon';
import RupeeIconComponent from './RupeeIcon';
import type { IconProps } from '.';

// add new icons here to make them visible in storybook
const iconMap: Record<string, React.ComponentType<IconProps>> = {
  CreditCardIcon: CreditCardIconComponent,
  DollarIcon: DollarIconComponent,
  RupeeIcon: RupeeIconComponent,
};

export default iconMap;
