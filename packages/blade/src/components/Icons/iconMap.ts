import ArrowDownIconComponent from './ArrowDownIcon';
import ArrowLeftIconComponent from './ArrowLeftIcon';
import ArrowRightIconComponent from './ArrowRightIcon';
import ArrowUpIconComponent from './ArrowUpIcon';
import ArrowUpRightIconComponent from './ArrowUpRightIcon';
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
import HomeIconComponent from './HomeIcon';
import InfoIconComponent from './InfoIcon';
import PauseIconComponent from './PauseIcon';
import PlusIconComponent from './PlusIcon';
import RupeeIconComponent from './RupeeIcon';
import SearchIconComponent from './SearchIcon';
import TrashIconComponent from './TrashIcon';
import AlertTriangleIconComponent from './AlertTriangleIcon';
import AlertOctagonIconComponent from './AlertOctagonIcon';
import CheckIconComponent from './CheckIcon';
import CheckCircleIconComponent from './CheckCircleIcon';
import RefreshLeftIconComponent from './RefreshLeftIcon';
import RotateCounterClockWiseIconComponent from './RotateCounterClockWiseIcon';
import TrendingUpIconComponent from './TrendingUpIcon';
import TrendingDownIconComponent from './TrendingDownIcon';
import HelpCircleIconComponent from './HelpCircleIcon';
import ExternalLinkIconComponent from './ExternalLinkIcon';
import MinusIconComponent from './MinusIcon';
import type { IconComponent } from '.';

// add new icons here to make them visible in storybook
const iconMap: Record<string, IconComponent> = {
  ArrowLeftIcon: ArrowLeftIconComponent,
  ArrowDownIcon: ArrowDownIconComponent,
  ArrowRightIcon: ArrowRightIconComponent,
  ArrowUpIcon: ArrowUpIconComponent,
  ArrowUpRightIcon: ArrowUpRightIconComponent,
  AlertTriangleIcon: AlertTriangleIconComponent,
  AlertOctagonIcon: AlertOctagonIconComponent,
  CheckIcon: CheckIconComponent,
  CheckCircleIcon: CheckCircleIconComponent,
  ChevronDownIcon: ChevronDownIconComponent,
  ChevronLeftIcon: ChevronLeftIconComponent,
  ChevronRightIcon: ChevronRightIconComponent,
  ChevronUpIcon: ChevronUpIconComponent,
  CloseIcon: CloseIconComponent,
  CreditCardIcon: CreditCardIconComponent,
  DollarIcon: DollarIconComponent,
  DownloadIcon: DownloadIconComponent,
  EditIcon: EditIconComponent,
  ExternalLinkIcon: ExternalLinkIconComponent,
  EyeIcon: EyeIconComponent,
  EyeOffIcon: EyeOffIconComponent,
  HelpCircleIcon: HelpCircleIconComponent,
  HistoryIcon: HistoryIconComponent,
  HomeIcon: HomeIconComponent,
  InfoIcon: InfoIconComponent,
  MinusIcon: MinusIconComponent,
  PauseIcon: PauseIconComponent,
  PlusIcon: PlusIconComponent,
  RupeeIcon: RupeeIconComponent,
  SearchIcon: SearchIconComponent,
  TrashIcon: TrashIconComponent,
  RefreshLeftIcon: RefreshLeftIconComponent,
  RotateCounterClockWiseIcon: RotateCounterClockWiseIconComponent,
  TrendingUpIcon: TrendingUpIconComponent,
  TrendingDownIcon: TrendingDownIconComponent,
};

export default iconMap;
