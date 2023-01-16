import type { Theme } from '~components/BladeProvider';
import type { DotNotationColorStringToken } from '~src/_helpers/types';
import type { Feedback } from '~tokens/theme/theme';

type FeedbackIconColors = `feedback.icon.${DotNotationColorStringToken<
  Theme['colors']['feedback']['icon']
>}`;

type FeedbackActionIconColors = `feedback.${Feedback}.action.icon.${DotNotationColorStringToken<
  Theme['colors']['feedback'][Feedback]['action']['icon']
>}`;

type ActionIconColors = `action.icon.${DotNotationColorStringToken<
  Theme['colors']['action']['icon']
>}`;

type TextIconColors = `surface.text.${DotNotationColorStringToken<
  Theme['colors']['surface']['text']
>}`;

type SurfaceActionIconColors = `surface.action.icon.${DotNotationColorStringToken<
  Theme['colors']['surface']['action']['icon']
>}`;

type BadgeIconColors = `badge.icon.${DotNotationColorStringToken<
  Theme['colors']['badge']['icon']
>}`;

export type IconSize = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | '2xlarge';
export type IconProps = {
  /**
   * Color token (not to be confused with actual hsla value)
   */
  color:
    | ActionIconColors
    | SurfaceActionIconColors
    | FeedbackIconColors
    | FeedbackActionIconColors
    | TextIconColors
    | BadgeIconColors
    | 'currentColor'; // currentColor is useful for letting the SVG inherit color property from its container
  size: IconSize;
};
export type IconComponent = React.ComponentType<IconProps>;

export { default as ArrowDownIcon } from './ArrowDownIcon';
export { default as ArrowLeftIcon } from './ArrowLeftIcon';
export { default as ArrowRightIcon } from './ArrowRightIcon';
export { default as ArrowUpRightIcon } from './ArrowUpRightIcon';
export { default as ArrowUpIcon } from './ArrowUpIcon';
export { default as AttachmentIcon } from './AttachmentIcon';
export { default as CheckIcon } from './CheckIcon';
export { default as ChevronDownIcon } from './ChevronDownIcon';
export { default as ChevronLeftIcon } from './ChevronLeftIcon';
export { default as ChevronRightIcon } from './ChevronRightIcon';
export { default as ChevronUpIcon } from './ChevronUpIcon';
export { default as CloseIcon } from './CloseIcon';
export { default as CreditCardIcon } from './CreditCardIcon';
export { default as DollarIcon } from './DollarIcon';
export { default as DownloadIcon } from './DownloadIcon';
export { default as EditIcon } from './EditIcon';
export { default as EyeIcon } from './EyeIcon';
export { default as EyeOffIcon } from './EyeOffIcon';
export { default as FileTextIcon } from './FileTextIcon';
export { default as HistoryIcon } from './HistoryIcon';
export { default as HomeIcon } from './HomeIcon';
export { default as InfoIcon } from './InfoIcon';
export { default as LinkIcon } from './LinkIcon';
export { default as LockIcon } from './LockIcon';
export { default as PauseIcon } from './PauseIcon';
export { default as PlusIcon } from './PlusIcon';
export { default as RupeeIcon } from './RupeeIcon';
export { default as SearchIcon } from './SearchIcon';
export { default as SettingsIcon } from './SettingsIcon';
export { default as SlashIcon } from './SlashIcon';
export { default as BankIcon } from './BankIcon';
export { default as TrashIcon } from './TrashIcon';
export { default as AlertTriangleIcon } from './AlertTriangleIcon';
export { default as AlertOctagonIcon } from './AlertOctagonIcon';
export { default as CheckCircleIcon } from './CheckCircleIcon';
export { default as MinusIcon } from './MinusIcon';
export { default as TrendingUpIcon } from './TrendingUpIcon';
export { default as TrendingDownIcon } from './TrendingDownIcon';
export { default as UsersIcon } from './UsersIcon';
export { default as HelpCircleIcon } from './HelpCircleIcon';
export { default as ExternalLinkIcon } from './ExternalLinkIcon';
export { default as MailIcon } from './MailIcon';
export { default as AlertCircleIcon } from './AlertCircleIcon';
export { default as AlertOnlyIcon } from './AlertOnlyIcon';
export { default as ScanIcon } from './ScanIcon';
export { default as BellIcon } from './BellIcon';
export { default as BellOffIcon } from './BellOffIcon';
export { default as BookmarkIcon } from './BookmarkIcon';
export { default as CheckSquareIcon } from './CheckSquareIcon';
export { default as ClipboardIcon } from './ClipboardIcon';
export { default as CommandIcon } from './CommandIcon';
export { default as CopyIcon } from './CopyIcon';
export { default as CropIcon } from './CropIcon';
export { default as CutIcon } from './CutIcon';
export { default as DownloadCloudIcon } from './DownloadCloudIcon';
export { default as EditInlineIcon } from './EditInlineIcon';
export { default as EditComposeIcon } from './EditComposeIcon';
export { default as FileIcon } from './FileIcon';
export { default as FilePlusIcon } from './FilePlusIcon';
export { default as FileMinusIcon } from './FileMinusIcon';
export { default as FilterIcon } from './FilterIcon';
export { default as FlagIcon } from './FlagIcon';
export { default as FolderIcon } from './FolderIcon';
export { default as GlobeIcon } from './GlobeIcon';
export { default as HashIcon } from './HashIcon';
export { default as HeartIcon } from './HeartIcon';
export { default as LogInIcon } from './LogInIcon';
export { default as LogOutIcon } from './LogOutIcon';
export { default as MaximizeIcon } from './MaximizeIcon';
export { default as FullScreenEnterIcon } from './FullScreenEnterIcon';
export { default as FullScreenExitIcon } from './FullScreenExitIcon';
export { default as MenuIcon } from './MenuIcon';
export { default as MicIcon } from './MicIcon';
export { default as MicOffIcon } from './MicOffIcon';
export { default as MinimizeIcon } from './MinimizeIcon';
export { default as MinusSquareIcon } from './MinusSquareIcon';
export { default as MinusCircleIcon } from './MinusCircleIcon';
export { default as MoreVerticalIcon } from './MoreVerticalIcon';
export { default as MoreHorizontalIcon } from './MoreHorizontalIcon';
export { default as MoveIcon } from './MoveIcon';
export { default as PauseCircleIcon } from './PauseCircleIcon';
export { default as PlayIcon } from './PlayIcon';
export { default as PlayCircleIcon } from './PlayCircleIcon';
export { default as PlusCircleIcon } from './PlusCircleIcon';
export { default as PlusSquareIcon } from './PlusSquareIcon';
export { default as PowerIcon } from './PowerIcon';
export { default as RefreshClockWiseIcon } from './RefreshClockWiseIcon';
export { default as RepeatIcon } from './RepeatIcon';
export { default as RotateClockWiseIcon } from './RotateClockWiseIcon';
export { default as RotateCounterClockWiseIcon } from './RotateCounterClockWiseIcon';
export { default as SaveIcon } from './SaveIcon';
export { default as ShareIcon } from './ShareIcon';
export { default as ExportIcon } from './ExportIcon';
export { default as ShoppingCartIcon } from './ShoppingCartIcon';
export { default as StopCircleIcon } from './StopCircleIcon';
export { default as SunIcon } from './SunIcon';
export { default as ToggleLeftIcon } from './ToggleLeftIcon';
export { default as ToggleRightIcon } from './ToggleRightIcon';
export { default as ListIcon } from './ListIcon';
export { default as StarIcon } from './StarIcon';
export { default as SlidersIcon } from './SlidersIcon';
export { default as PaperclipIcon } from './PaperclipIcon';
export { default as UploadCloudIcon } from './UploadCloudIcon';
export { default as TargetIcon } from './TargetIcon';
export { default as UnlockIcon } from './UnlockIcon';
export { default as ThumbsUpIcon } from './ThumbsUpIcon';
export { default as ThumbsDownIcon } from './ThumbsDownIcon';
export { default as UploadIcon } from './UploadIcon';
export { default as VideoIcon } from './VideoIcon';
export { default as XSquareIcon } from './XSquareIcon';
export { default as XCircleIcon } from './XCircleIcon';
export { default as ZapIcon } from './ZapIcon';
export { default as ZoomOutIcon } from './ZoomOutIcon';
export { default as ZoomInIcon } from './ZoomInIcon';
export { default as AlignJustifyIcon } from './AlignJustifyIcon';
export { default as AlignRightIcon } from './AlignRightIcon';
export { default as AlignLeftIcon } from './AlignLeftIcon';
export { default as AlignCenterIcon } from './AlignCenterIcon';
export { default as AnchorIcon } from './AnchorIcon';
export { default as BoldIcon } from './BoldIcon';
export { default as ScissorsIcon } from './ScissorsIcon';
export { default as DeleteIcon } from './DeleteIcon';
export { default as GridIcon } from './GridIcon';
export { default as ImageIcon } from './ImageIcon';
export { default as InboxIcon } from './InboxIcon';
export { default as ItalicIcon } from './ItalicIcon';
export { default as TypeIcon } from './TypeIcon';
export { default as UnderlineIcon } from './UnderlineIcon';
export { default as FilmIcon } from './FilmIcon';
export { default as AirplayIcon } from './AirplayIcon';
export { default as AtSignIcon } from './AtSignIcon';
export { default as BluetoothIcon } from './BluetoothIcon';
export { default as CameraIcon } from './CameraIcon';
export { default as CameraOffIcon } from './CameraOffIcon';
export { default as CastIcon } from './CastIcon';
export { default as MessageCircleIcon } from './MessageCircleIcon';
export { default as MessageSquareIcon } from './MessageSquareIcon';
export { default as PhoneCallIcon } from './PhoneCallIcon';
export { default as PhoneIcon } from './PhoneIcon';
export { default as PhoneOutgoingIcon } from './PhoneOutgoingIcon';
export { default as PhoneOffIcon } from './PhoneOffIcon';
export { default as PhoneMissedIcon } from './PhoneMissedIcon';
export { default as PhoneIncomingIcon } from './PhoneIncomingIcon';
export { default as PhoneForwardedIcon } from './PhoneForwardedIcon';
export { default as RadioIcon } from './RadioIcon';
export { default as VideoOffIcon } from './VideoOffIcon';
export { default as VoicemailIcon } from './VoicemailIcon';
export { default as WifiIcon } from './WifiIcon';
export { default as WifiOffIcon } from './WifiOffIcon';
export { default as ApertureIcon } from './ApertureIcon';
export { default as AwardIcon } from './AwardIcon';
export { default as BoxIcon } from './BoxIcon';
export { default as BriefcaseIcon } from './BriefcaseIcon';
export { default as ChromeIcon } from './ChromeIcon';
export { default as CircleIcon } from './CircleIcon';
export { default as CrosshairIcon } from './CrosshairIcon';
export { default as DiscIcon } from './DiscIcon';
export { default as DropletIcon } from './DropletIcon';
export { default as FeatherIcon } from './FeatherIcon';
export { default as LayersIcon } from './LayersIcon';
export { default as LayoutIcon } from './LayoutIcon';
export { default as SidebarIcon } from './SidebarIcon';
export { default as SquareIcon } from './SquareIcon';
export { default as TriangleIcon } from './TriangleIcon';
export { default as LifeBuoyIcon } from './LifeBuoyIcon';
export { default as LoaderIcon } from './LoaderIcon';
export { default as OctagonIcon } from './OctagonIcon';
export { default as PackageIcon } from './PackageIcon';
export { default as PercentIcon } from './PercentIcon';
export { default as ShieldIcon } from './ShieldIcon';
export { default as UmbrellaIcon } from './UmbrellaIcon';
export { default as WindIcon } from './WindIcon';
export { default as ArrowUpLeftIcon } from './ArrowUpLeftIcon';
export { default as ArrowDownRightIcon } from './ArrowDownRightIcon';
export { default as ArrowDownLeftIcon } from './ArrowDownLeftIcon';
export { default as ChevronsRightIcon } from './ChevronsRightIcon';
export { default as ChevronsLeftIcon } from './ChevronsLeftIcon';
export { default as ChevronsDownIcon } from './ChevronsDownIcon';
export { default as ChevronsUpIcon } from './ChevronsUpIcon';
export { default as CornerUpRightIcon } from './CornerUpRightIcon';
export { default as CornerDownLeftIcon } from './CornerDownLeftIcon';
export { default as CornerRightUpIcon } from './CornerRightUpIcon';
export { default as CornerRightDownIcon } from './CornerRightDownIcon';
export { default as CornerLeftUpIcon } from './CornerLeftUpIcon';
export { default as CornerDownRightIcon } from './CornerDownRightIcon';
export { default as CornerUpLeftIcon } from './CornerUpLeftIcon';
export { default as CornerLeftDownIcon } from './CornerLeftDownIcon';
export { default as FastForwardIcon } from './FastForwardIcon';
export { default as HeadphonesIcon } from './HeadphonesIcon';
export { default as MusicIcon } from './MusicIcon';
export { default as RewindIcon } from './RewindIcon';
export { default as SkipBackIcon } from './SkipBackIcon';
export { default as SkipForwardIcon } from './SkipForwardIcon';
export { default as VolumeIcon } from './VolumeIcon';
export { default as VolumeMuteIcon } from './VolumeMuteIcon';
export { default as VolumeLowIcon } from './VolumeLowIcon';
export { default as VolumeHighIcon } from './VolumeHighIcon';
export { default as CalendarIcon } from './CalendarIcon';
export { default as ClockIcon } from './ClockIcon';
export { default as CloudIcon } from './CloudIcon';
export { default as CloudDrizzleIcon } from './CloudDrizzleIcon';
export { default as CloudSnowIcon } from './CloudSnowIcon';
export { default as CloudOffIcon } from './CloudOffIcon';
export { default as CloudLightningIcon } from './CloudLightningIcon';
export { default as MoonIcon } from './MoonIcon';
export { default as SunsetIcon } from './SunsetIcon';
export { default as SunriseIcon } from './SunriseIcon';
export { default as WatchIcon } from './WatchIcon';
export { default as CloudRainIcon } from './CloudRainIcon';
export { default as BatteryChargingIcon } from './BatteryChargingIcon';
export { default as BatteryIcon } from './BatteryIcon';
export { default as CpuIcon } from './CpuIcon';
export { default as MonitorIcon } from './MonitorIcon';
export { default as PrinterIcon } from './PrinterIcon';
export { default as ServerIcon } from './ServerIcon';
export { default as SmartphoneIcon } from './SmartphoneIcon';
export { default as SpeakerIcon } from './SpeakerIcon';
export { default as TabletIcon } from './TabletIcon';
export { default as ThermometerIcon } from './ThermometerIcon';
export { default as TvIcon } from './TvIcon';
export { default as CodepenIcon } from './CodepenIcon';
export { default as FacebookIcon } from './FacebookIcon';
export { default as GitlabIcon } from './GitlabIcon';
export { default as GithubIcon } from './GithubIcon';
export { default as InstagramIcon } from './InstagramIcon';
export { default as PocketIcon } from './PocketIcon';
export { default as SlackIcon } from './SlackIcon';
export { default as TwitterIcon } from './TwitterIcon';
export { default as UserCheckIcon } from './UserCheckIcon';
export { default as UserXIcon } from './UserXIcon';
export { default as UserPlusIcon } from './UserPlusIcon';
export { default as UserMinusIcon } from './UserMinusIcon';
export { default as ActivityIcon } from './ActivityIcon';
export { default as BarChartIcon } from './BarChartIcon';
export { default as BarChartAltIcon } from './BarChartAltIcon';
export { default as PieChartIcon } from './PieChartIcon';
export { default as CompassIcon } from './CompassIcon';
export { default as MapIcon } from './MapIcon';
export { default as MapPinIcon } from './MapPinIcon';
export { default as NavigationIcon } from './NavigationIcon';
export { default as DollarsIcon } from './DollarsIcon';
export { default as RupeesIcon } from './RupeesIcon';
export { default as DashboardIcon } from './DashboardIcon';
export { default as InvoicesIcon } from './InvoicesIcon';
export { default as PaymentLinksIcon } from './PaymentLinksIcon';
export { default as PaymentButtonsIcon } from './PaymentButtonsIcon';
export { default as PaymentPagesIcon } from './PaymentPagesIcon';
export { default as RoutesIcon } from './RoutesIcon';
export { default as SubscriptionsIcon } from './SubscriptionsIcon';
export { default as SmartCollectIcon } from './SmartCollectIcon';
export { default as CustomersIcon } from './CustomersIcon';
export { default as OffersIcon } from './OffersIcon';
export { default as ReportsIcon } from './ReportsIcon';
export { default as MyAccountIcon } from './MyAccountIcon';
export { default as RazorpayIcon } from './RazorpayIcon';
export { default as RazorpayXIcon } from './RazorpayXIcon';
export { default as BookIcon } from './BookIcon';
export { default as SettlementsIcon } from './SettlementsIcon';
export { default as ShuffleIcon } from './ShuffleIcon';
export { default as TagIcon } from './TagIcon';
export { default as UserIcon } from './UserIcon';
export { default as TransactionsIcon } from './TransactionsIcon';
// # append_icon_export
