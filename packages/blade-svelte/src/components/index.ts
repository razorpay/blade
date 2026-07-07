// Re-export Base components with their original names to ensure they're available
// when other components reference them at runtime
export { default as BaseText } from './Typography/BaseText/BaseText.svelte';
export { default as BaseButton } from './Button/BaseButton/BaseButton.svelte';
export { default as BaseSpinner } from './Spinner/BaseSpinner/BaseSpinner.svelte';
export { default as BaseAmount } from './Amount/BaseAmount/BaseAmount.svelte';
export { default as BaseLink } from './Link/BaseLink/BaseLink.svelte';
export { default as BaseCounter } from './Counter/BaseCounter/BaseCounter.svelte';

// Typography
export { default as Text } from './Typography/Text/Text.svelte';
export { default as Heading } from './Typography/Heading/Heading.svelte';
export { default as Code } from './Typography/Code/Code.svelte';

// Button
export { default as Button } from './Button/Button.svelte';

// IconButton
export { default as IconButton } from './Button/IconButton/IconButton.svelte';
export type { IconButtonProps } from './Button/IconButton/types';
export { BaseIconButton } from './Button/IconButton/BaseIconButton';

// Link
export { default as Link } from './Link/Link.svelte';

// Spinner (alias to BaseSpinner for backward compatibility)
export { default as Spinner } from './Spinner/BaseSpinner/BaseSpinner.svelte';

// Amount
export { default as Amount } from './Amount/Amount.svelte';

// Icons
export * from './Icons';
// Badge
export { default as Badge } from './Badge/Badge.svelte';

// Counter
export { default as Counter } from './Counter/Counter.svelte';
// Divider
export { default as Divider } from './Divider/Divider.svelte';
// Skeleton
export { default as Skeleton } from './Skeleton/Skeleton.svelte';
export type { SkeletonProps } from './Skeleton/types';

// Accordion
export { Accordion, AccordionItem, AccordionItemHeader, AccordionItemBody } from './Accordion';

// Collapsible
export {
  Collapsible,
  CollapsibleButton,
  CollapsibleLink,
  CollapsibleText,
  CollapsibleBody,
} from './Collapsible';
export type {
  CollapsibleProps,
  CollapsibleButtonProps,
  CollapsibleLinkProps,
  CollapsibleTextProps,
  CollapsibleBodyProps,
} from './Collapsible';

// Switch
export { default as Switch } from './Switch/Switch.svelte';
export type { SwitchProps, SwitchOnChange, SwitchInstance } from './Switch/types';

// Card
export {
  Card,
  CardBody,
  CardHeader,
  CardHeaderLeading,
  CardHeaderTrailing,
  CardHeaderIcon,
  CardHeaderCounter,
  CardHeaderBadge,
  CardHeaderAmount,
  CardHeaderText,
  CardHeaderLink,
  CardHeaderIconButton,
  CardFooter,
  CardFooterLeading,
  CardFooterTrailing,
} from './Card';

// AppBar
export { AppBar, AppBarLeading, AppBarActions } from './AppBar';
export type { AppBarProps, AppBarLeadingProps, AppBarActionsProps, AppBarVariant } from './AppBar';

// TrustBadge
export { TrustBadge } from './TrustBadge';
export type { TrustBadgeProps, TrustBadgeVariant, TrustBadgeEmphasis } from './TrustBadge';

// Chip
export { default as Chip } from './Chip/Chip.svelte';
export { default as ChipGroup } from './Chip/ChipGroup.svelte';

// Checkbox
export { default as Checkbox } from './Checkbox/Checkbox.svelte';
export { default as CheckboxGroup } from './Checkbox/CheckboxGroup.svelte';
export type {
  CheckboxProps,
  CheckboxGroupProps,
  CheckboxOnChange,
  CheckboxGroupOnChange,
  CheckboxInstance,
  CheckboxSize,
} from './Checkbox/types';

// ActionList
export {
  ActionList,
  ActionListItem,
  ActionListItemAsset,
  ActionListItemText,
  ActionListItemIcon,
  ActionListItemAvatar,
  ActionListItemBadge,
  ActionListItemBadgeGroup,
  ActionListSection,
} from './ActionList';
export type {
  ActionListProps,
  ActionListItemProps,
  ActionListItemAssetProps,
  ActionListItemTextProps,
  ActionListItemIconProps,
  ActionListItemAvatarProps,
  ActionListItemBadgeProps,
  ActionListItemBadgeGroupProps,
  ActionListSectionProps,
  ActionListSelectionType,
  ActionListItemClickPayload,
  ActionListItemSelectPayload,
} from './ActionList';

// Radio
export { default as Radio } from './Radio/Radio.svelte';
export { default as RadioGroup } from './Radio/RadioGroup.svelte';
export type {
  RadioProps,
  RadioGroupProps,
  RadioGroupOnChange,
  RadioInstance,
  RadioSize,
} from './Radio/types';

// Alert
export { default as Alert } from './Alert/Alert.svelte';

// AnnouncementBanner
export { default as AnnouncementBanner } from './AnnouncementBanner/AnnouncementBanner.svelte';
export type { AnnouncementBannerProps } from './AnnouncementBanner/types';

// Avatar
export { default as Avatar } from './Avatar/Avatar.svelte';
export { default as AvatarGroup } from './Avatar/AvatarGroup.svelte';

// Breadcrumb
export { default as Breadcrumb } from './Breadcrumb/Breadcrumb.svelte';
export { default as BreadcrumbItem } from './Breadcrumb/BreadcrumbItem.svelte';

// Tooltip
export { default as Tooltip } from './Tooltip/Tooltip.svelte';
export { default as TooltipInteractiveWrapper } from './Tooltip/TooltipInteractiveWrapper.svelte';
export type {
  TooltipProps,
  TooltipPlacement,
  TooltipInteractiveWrapperProps,
} from './Tooltip/types';

// Toast
export { default as Toast } from './Toast/Toast.svelte';
export { default as ToastContainer } from './Toast/ToastContainer.svelte';
export { useToast } from './Toast/useToast';
export type {
  ToastProps,
  ToastContainerProps,
  ToastType,
  ToastColor,
  ToastAction,
  ToastCallbackPayload,
  BladeToast,
  UseToastReturn,
} from './Toast/types';

// BottomSheet
export { BottomSheet, BottomSheetHeader, BottomSheetBody, BottomSheetFooter } from './BottomSheet';
export type {
  BottomSheetProps,
  BottomSheetHeaderProps,
  BottomSheetBodyProps,
  BottomSheetFooterProps,
  SnapPoints,
} from './BottomSheet';

// SegmentedControl
export { SegmentedControl, SegmentedControlItem } from './SegmentedControl';
export type {
  SegmentedControlProps,
  SegmentedControlItemProps,
  SegmentedControlSize,
} from './SegmentedControl';

// Input
export { TextInput } from './Input/TextInput';
export type { TextInputProps, TextInputType } from './Input/TextInput';
export { SearchInput } from './Input/SearchInput';
export type { SearchInputProps } from './Input/SearchInput';
export { OTPInput } from './Input/OTPInput';
export type { OTPInputProps, OTPInputInstance, OTPInputOnEventWithIndex } from './Input/OTPInput';
export { PhoneNumberInput } from './Input/PhoneNumberInput';
export type {
  PhoneNumberInputProps,
  PhoneNumberInputInstance,
  PhoneNumberChangePayload,
} from './Input/PhoneNumberInput';

// InputGroup
export { InputGroup, InputRow } from './InputGroup';
export type { InputGroupProps, InputRowProps } from './InputGroup';

// BladeProvider
export * from './BladeProvider';
