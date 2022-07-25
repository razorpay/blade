import CloseIconComponent from './CloseIcon';
import ChevronDownIconComponent from './ChevronDownIcon';
import ChevronLeftIconComponent from './ChevronLeftIcon';
import ChevronUpIconComponent from './ChevronUpIcon';
import ChevronRightIconComponent from './ChevronRightIcon';
import CreditCardIconComponent from './CreditCardIcon';
import DollarIconComponent from './DollarIcon';
import DownloadIconComponent from './DownloadIcon';
import EditIconComponent from './EditIcon';
import EyeIconComponent from './EyeIcon';
import EyeOffIconComponent from './EyeOffIcon';
import HistoryIconComponent from './HistoryIcon';
import PauseIconComponent from './PauseIcon';
import PlusIconComponent from './PlusIcon';
import RupeeIconComponent from './RupeeIcon';
import TrashIconComponent from './TrashIcon';
import InfoIconComponent from './InfoIcon';
import CheckIconComponent from './CheckIcon';
import type { IconComponent } from '.';

// add new icons here to make them visible in storybook
const iconMap: Record<string, IconComponent> = {
  CloseIcon: CloseIconComponent,
  ChevronDownIcon: ChevronDownIconComponent,
  ChevronLeftIcon: ChevronLeftIconComponent,
  ChevronUpIcon: ChevronUpIconComponent,
  ChevronRightIcon: ChevronRightIconComponent,
  CreditCardIcon: CreditCardIconComponent,
  DollarIcon: DollarIconComponent,
  DownloadIcon: DownloadIconComponent,
  EditIcon: EditIconComponent,
  EyeIcon: EyeIconComponent,
  EyeOffIcon: EyeOffIconComponent,
  HistoryIcon: HistoryIconComponent,
  PauseIcon: PauseIconComponent,
  PlusIcon: PlusIconComponent,
  RupeeIcon: RupeeIconComponent,
  TrashIcon: TrashIconComponent,
  InfoIcon: InfoIconComponent,
  CheckIcon: CheckIconComponent,
};

export default iconMap;
