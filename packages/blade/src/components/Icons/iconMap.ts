import ChevronDownIconComponent from './ChevronDownIcon';
import ChevronLeftIconComponent from './ChevronLeftIcon';
import ChevronRightIconComponent from './ChevronRightIcon';
import ChevronUpIconComponent from './ChevronUpIcon';
import CloseIconComponent from './CloseIcon';
import CreditCardIconComponent from './CreditCardIcon';
import DollarIconComponent from './DollarIcon';
import DownloadIconComponent from './DownloadIcon';
import EditIconComponent from './EditIcon';
import EyeIconComponent from './EyeIcon';
import EyeOffIconComponent from './EyeOffIcon';
import HistoryIconComponent from './HistoryIcon';
import InfoIconComponent from './InfoIcon';
import PauseIconComponent from './PauseIcon';
import PlusIconComponent from './PlusIcon';
import RupeeIconComponent from './RupeeIcon';
import TrashIconComponent from './TrashIcon';
import type { IconComponent } from '.';

// add new icons here to make them visible in storybook
const iconMap: Record<string, IconComponent> = {
  ChevronDownIcon: ChevronDownIconComponent,
  ChevronLeftIcon: ChevronLeftIconComponent,
  ChevronRightIcon: ChevronRightIconComponent,
  ChevronUpIcon: ChevronUpIconComponent,
  CloseIcon: CloseIconComponent,
  CreditCardIcon: CreditCardIconComponent,
  DollarIcon: DollarIconComponent,
  DownloadIcon: DownloadIconComponent,
  EditIcon: EditIconComponent,
  EyeIcon: EyeIconComponent,
  EyeOffIcon: EyeOffIconComponent,
  HistoryIcon: HistoryIconComponent,
  InfoIcon: InfoIconComponent,
  PauseIcon: PauseIconComponent,
  PlusIcon: PlusIconComponent,
  RupeeIcon: RupeeIconComponent,
  TrashIcon: TrashIconComponent,
};

export default iconMap;
