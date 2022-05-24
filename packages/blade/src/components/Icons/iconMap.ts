import CloseIconComponent from './CloseIcon';
import ChevronDownIconComponent from './ChevronDownIcon';
import ChevronLeftIconComponent from './ChevronLeftIcon';
import ChevronUpIconComponent from './ChevronUpIcon';
import ChevronRightIconComponent from './ChevronRightIcon';
import CreditCardIconComponent from './CreditCardIcon';
import DollarIconComponent from './DollarIcon';
import EyeIconComponent from './EyeIcon';
import EyeOffIconComponent from './EyeOffIcon';
import RupeeIconComponent from './RupeeIcon';
import type { IconComponentType } from '.';

// add new icons here to make them visible in storybook
const iconMap: Record<string, IconComponentType> = {
  CloseIcon: CloseIconComponent,
  ChevronDownIcon: ChevronDownIconComponent,
  ChevronLeftIcon: ChevronLeftIconComponent,
  ChevronUpIcon: ChevronUpIconComponent,
  ChevronRightIcon: ChevronRightIconComponent,
  CreditCardIcon: CreditCardIconComponent,
  DollarIcon: DollarIconComponent,
  EyeIcon: EyeIconComponent,
  EyeOffIcon: EyeOffIconComponent,
  RupeeIcon: RupeeIconComponent,
};

export default iconMap;
