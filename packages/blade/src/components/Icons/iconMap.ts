import ChevronDownIconComponent from './ChevronDownIcon';
import ChevronUpIconComponent from './ChevronUpIcon';
import CreditCardIconComponent from './CreditCardIcon';
import DollarIconComponent from './DollarIcon';
import RupeeIconComponent from './RupeeIcon';
import type { IconProps } from '.';

// add new icons here to make them visible in storybook
const iconMap: Record<string, React.ComponentType<IconProps>> = {
  ChevronDownIcon: ChevronDownIconComponent,
  ChevronUpIcon: ChevronUpIconComponent,
  CreditCardIcon: CreditCardIconComponent,
  DollarIcon: DollarIconComponent,
  RupeeIcon: RupeeIconComponent,
};

export default iconMap;
