// The checkout component library: stateful Svelte components over the
// runes under `../runes`, styled by the class maps beside them
// (`<name>/styles.ts`); runtime theming is CSS vars only. Published as
// `@razorpay/blade-svelte/components` (`../components-entry.ts`); the
// package has no root entry. Context plumbing (`provide*`/`get*`) is not
// exported: BladeProvider wires it, and the imperative APIs below use the
// global instances.
export { default as Alert } from './alert/Alert.svelte';
export { default as Amount } from './amount/Amount.svelte';
export { default as Button } from './button/Button.svelte';
export { default as ButtonGroup } from './button-group/ButtonGroup.svelte';
export { default as Carousel } from './carousel/Carousel.svelte';
export { default as Checkbox } from './checkbox/Checkbox.svelte';
export { default as Chip } from './chip/Chip.svelte';
export { default as ChipGroup } from './chip/ChipGroup.svelte';
export { default as Collapsible } from './collapsible/Collapsible.svelte';
export { default as CollapsibleChevron } from './collapsible/CollapsibleChevron.svelte';
export { default as Counter } from './counter/Counter.svelte';
export { default as CounterInput } from './counter-input/CounterInput.svelte';
// Card and its parts, as Blade React spells them; each part's classes are
// exported apart. Card renders its parts as children: importing Card does
// not bring CardHeader, CardBody or CardFooter along.
export { Card, CARD_AXES, resolveCard } from './card';
export type { CardStyleProps, CardClasses, CardStyleResolver } from './card';
export { CardHeader, CardBody, CardFooter } from './card-children';
export { resolveCardHeader, resolveCardBody, resolveCardFooter } from './card-children/styles';
export type {
  HeaderClasses,
  BodyClasses,
  FooterClasses,
  CardHeaderLook,
  CardFooterLook,
  CardFooterAction,
} from './card-children/styles';
// The overlays: a component per shape over the same runes (`createOverlay`).
// Modal, BottomSheet and Drawer render their parts as children, so their
// parts load only when used.
export { Modal, MODAL_AXES } from './modal';
export type {
  ModalStyleProps,
  ModalBehaviourProps,
  ModalClassesOverride,
  ModalClassesProp,
} from './modal';
export { BottomSheet, BOTTOM_SHEET_AXES } from './bottom-sheet';
export type {
  BottomSheetStyleProps,
  BottomSheetBehaviourProps,
  BottomSheetComponent,
} from './bottom-sheet';
export { Drawer, DRAWER_AXES } from './drawer';
export type { DrawerStyleProps, DrawerBehaviourProps, DrawerComponent } from './drawer';
export { Popover, POPOVER_AXES } from './popover';
export type { PopoverStyleProps, PopoverBehaviourProps, PopoverComponent } from './popover';
export { Menu } from './menu';
export type { MenuStyleProps, MenuBehaviourProps, MenuComponent } from './menu';
// Their parts, as Blade React spells them, each over its own classes; the
// classes are exported apart for a part of the consumer's own, wired by
// `useModalHeader`.
export {
  ModalHeader,
  ModalBody,
  ModalFooter,
  BottomSheetHeader,
  BottomSheetBody,
  BottomSheetFooter,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
} from './modal-children';
export {
  resolvePopoverHeader,
  resolvePopoverBody,
  resolvePopoverFooter,
  resolveMenuBody,
  resolveModalHeader,
  resolveModalBody,
  resolveModalFooter,
  resolveBottomSheetHeader,
  resolveBottomSheetBody,
  resolveBottomSheetFooter,
  resolveDrawerHeader,
  resolveDrawerBody,
  resolveDrawerFooter,
} from './modal-children/styles';
export type {
  OverlayHeaderClasses,
  OverlayBodyClasses,
  OverlayFooterClasses,
  BottomSheetHeaderLook,
  DrawerHeaderLook,
  ModalBodyLook,
  BottomSheetBodyLook,
  DrawerBodyLook,
  DrawerFooterLook,
} from './modal-children/styles';
export { useModalHeader } from '../runes/modal/header.svelte';
export type { ModalHeaderOptions, ModalHeaderWiring } from '../runes/modal/header.svelte';
export { default as BladeProvider } from './blade-provider/BladeProvider.svelte';
export type {
  ComponentDefaults,
  ComponentName,
  ComponentStyleProps,
  DefaultSize,
} from './defaults';
export { default as InputGroup } from './input-group/InputGroup.svelte';
export { default as IconButton } from './icon-button/IconButton.svelte';
export { default as Icon } from './icon/Icon.svelte';
export { default as Link } from './link/Link.svelte';
export {
  ActionList,
  ActionListItem,
  ActionListSection,
  ACTION_LIST_AXES,
  actionListClasses,
} from './action-list';
export type { ActionListVariant, ActionListInset, ActionListStyleProps } from './action-list';
export { default as CardGroup } from './card-group/CardGroup.svelte';
export { default as CardGroupItem } from './card-group/CardGroupItem.svelte';
export { default as CardGroupSection } from './card-group/CardGroupSection.svelte';
export { default as OTPInput } from './otp-input/OTPInput.svelte';
export { default as PasswordInput } from './password-input/PasswordInput.svelte';
export { default as PhoneNumberInput } from './phone-number-input/PhoneNumberInput.svelte';
export { default as PhoneCountryList } from './phone-number-input/PhoneCountryList.svelte';
export { default as Radio } from './radio/Radio.svelte';
export { default as RadioGroup } from './radio/RadioGroup.svelte';
export { default as Switch } from './switch/Switch.svelte';
export { default as Tabs } from './tabs/Tabs.svelte';
export { default as TabItem } from './tabs/TabItem.svelte';
export { default as TabPanel } from './tabs/TabPanel.svelte';
export { default as TextArea } from './text-area/TextArea.svelte';
export { default as Tooltip } from './tooltip/Tooltip.svelte';
// Blade's toasts: the app renders a ToastContainer, `showToast` fills it.
export { default as ToastContainer } from './toast/ToastContainer.svelte';
export { showToast, createToasts } from './toast/toasts';
// A withdrawal an app hands Blade (`showToast`'s `cancelled`), or Blade hands it.
export { createCancel } from '../runes/base/cancel';
export type { Cancel } from '../runes/base/cancel';
export type {
  ShowToastControl,
  ShowToastOptions,
  ToastAction,
  ToastDismissReason,
  ToastLeading,
  Toasts,
} from './toast/toasts';
export { default as SearchInput } from './search-input/SearchInput.svelte';
export { default as TextInput } from './text-input/TextInput.svelte';

export type { BladeAdapters, BladeAdaptersOverride } from '../adapters';
export type { AxisValue, StyleAxes } from '../axes';
// Back: an app's back handler asks the open overlays first (`back()`).
export { back } from '../runes/layer/layers';
// The seams an app drives Blade through, all BladeProvider adapters
// (BladeProvider renders the overlay host):
// - `adapters.toasts` is the toast queue a ToastContainer shows
//   (`createToasts()`, or the app's own);
// - `adapters.form` is the app's form around the fields (`FormAdapter`);
// - `adapters.presentDropdown` may show a library dropdown its own way;
// - `adapters.vibrate`, `adapters.announce`, `adapters.locale`.
export type { HapticKind } from '../adapters';
export type { FormAdapter, FormVerdict, FieldRecord } from '../runes/form/types';
export type {
  ActionListRequest,
  DropdownKind,
  DropdownValues,
  PresentDropdownAdapter,
} from '../runes/modal/dropdown';
export type { SurfaceClasses } from './layer/styles';
// The types an app's handlers and props name; the runes behind the
// components are not a subpath.
export type { FormErrors } from '../runes/form/types';
export type { Placement } from '../runes/layer/placement';
export type { DialogDismissEvent } from '../runes/modal/dialog.svelte';

export type { ButtonBusyCause, ButtonClasses, ButtonStyleResolver } from './button/styles';
// The style taxonomy. The *_AXES values are for the component explorer; app
// code needs only the types.
export { BUTTON_AXES } from './button';
export type { ButtonStyleProps } from './button';
export type { SwitchClasses, SwitchStyleResolver } from './switch/styles';
export { SWITCH_AXES } from './switch';
export type { SwitchStyleProps } from './switch';
export type { CarouselClasses, CarouselStyleResolver } from './carousel/styles';
export type { CarouselStyleProps } from './carousel';
export type { PopupItemClasses, PopupItemIntent } from './shared/popup-list';
export type { TabsClasses, TabsStyleResolver } from './tabs/styles';
export { TABS_AXES } from './tabs';
export type { TabItemState, TabsStyleProps } from './tabs';
export type {
  CheckboxClasses,
  CheckboxSizeParts,
  CheckboxStyleResolver,
  CheckboxValidationState,
} from './checkbox/styles';
export { CHECKBOX_AXES } from './checkbox';
export type { CheckboxStyleProps } from './checkbox';
export type { ControlState } from './shared/control-state';
export { CHIP_GROUP_AXES } from './chip';
export type {
  ChipClasses,
  ChipColor,
  ChipGroupClasses,
  ChipGroupStyleProps,
  ChipGroupValidationState,
  ChipShared,
  ChipSize,
  ChipTone,
} from './chip';
export { COUNTER_AXES } from './counter';
export type { CounterClasses, CounterStyleProps } from './counter';
export { COUNTER_INPUT_AXES } from './counter-input';
export type { CounterInputClasses, CounterInputStyleProps } from './counter-input';
export type { AlertClasses, AlertStyleResolver } from './alert/styles';
export { ALERT_AXES } from './alert';
export type { AlertStyleProps } from './alert';
export type {
  InputGroupClasses,
  InputGroupSpan,
  InputGroupStyleResolver,
  InputGroupValidationState,
} from './input-group/styles';
export type { InputGroupStyleProps } from './input-group';
export type {
  CardGroupItemClasses,
  CardGroupItemContentProps,
  CardGroupClasses,
  CardGroupShared,
  CardGroupStyleResolver,
  CardGroupValidationState,
  CardGroupRowClasses,
  CardGroupClassesProp,
  CardGroupLookState,
  CardGroupSectionClasses,
  CardGroupItemState,
  CardGroupView,
  CardGroupChange,
  CardGroupItemClick,
  CardGroupDataSection,
  CardGroupVirtualClasses,
} from './card-group/styles';
export { CARD_GROUP_AXES, resolveCardGroup } from './card-group';
export type { CardGroupStyleProps } from './card-group';
export type {
  OTPInputChange,
  OTPInputClasses,
  OTPInputMethod,
  OTPInputStyleResolver,
  OTPInputValidationState,
} from './otp-input/styles';
export { OTP_INPUT_AXES } from './otp-input';
export type { OTPInputStyleProps } from './otp-input';
export type {
  RadioClasses,
  RadioGroupClasses,
  RadioGroupStyleResolver,
  RadioGroupValidationState,
} from './radio/styles';
export { RADIO_GROUP_AXES } from './radio';
export type { RadioGroupStyleProps } from './radio';
export {
  SegmentedControl,
  SegmentedControlItem,
  SEGMENTED_CONTROL_AXES,
} from './segmented-control';
export type {
  SegmentedControlItemProps,
  SegmentedControlProps,
  SegmentedControlStyleProps,
} from './segmented-control';
export type {
  TextAreaClasses,
  TextAreaStyleResolver,
  TextAreaValidationState,
} from './text-area/styles';
export type { TextAreaStyleProps } from './text-area';
export type {
  TextInputClasses,
  TextInputFrame,
  TextInputStyleResolver,
  TextInputValidationState,
} from './text-input/styles';
export type { TextInputStyleProps } from './text-input';
export { TEXT_INPUT_AXES } from './text-input/styles';
export { TEXT_AREA_AXES } from './text-area/styles';
export { PHONE_NUMBER_INPUT_AXES } from './phone-number-input/styles';
export { INPUT_GROUP_AXES } from './input-group/styles';
export type {
  ToastClasses,
  ToastCloseIconSnippet,
  ToastContainerClasses,
  ToastContainerStyleResolver,
  ToastStyleResolver,
} from './toast/styles';
export { TOAST_AXES, TOAST_CONTAINER_AXES } from './toast';
export type { ToastContainerStyleProps, ToastStyleProps } from './toast';
export type { CollapsibleClasses } from './collapsible/styles';
export type { TooltipClasses, TooltipStyleResolver } from './tooltip/styles';
export type { TooltipStyleProps } from './tooltip';
export type { AmountClasses, AmountStyleResolver } from './amount/styles';
export type { AmountStyleProps } from './amount';
export { AMOUNT_AXES } from './amount';
export type { AmountSuffix } from '../runes/amount/amount';
export type { LinkClasses, LinkStyleResolver } from './link/styles';
export { LINK_AXES } from './link';
export type { LinkStyleProps } from './link';
export type { IconButtonClasses, IconButtonStyleResolver } from './icon-button/styles';
export type { ButtonType } from '../runes/button/press.svelte';
export { ICON_BUTTON_AXES } from './icon-button';
export type { IconButtonStyleProps } from './icon-button';
export { BUTTON_GROUP_AXES } from './button-group';
export type { ButtonGroupStyleProps } from './button-group';
export type {
  PhoneNumberChange,
  PhoneNumberInputClasses,
  PhoneNumberInputStyleResolver,
} from './phone-number-input/styles';
export type { PhoneCountry, PhoneParts } from '../runes/phone/parts';
export type { OverlayLayout } from '../runes/layer/overlay';
// The default country list, for an app that adds its own patterns to it.
export { defaultPhoneCountries } from '../runes/phone/countries';
export type { PhoneNumberInputStyleProps } from './phone-number-input';
export type { IconBehaviourProps, IconClasses, IconStyleResolver } from './icon/styles';
export type { IconSource } from '../runes/icon/source';
export { ICON_AXES } from './icon';
export type { IconStyleProps } from './icon';
// The icons themselves are `@razorpay/blade-svelte/icons`.
export type { Glyph } from '../runes/icon/source';
// Style-only components: no behaviour model behind them.
export { AnnouncementBanner, ANNOUNCEMENT_BANNER_AXES } from './announcement-banner';
export type {
  AnnouncementBannerStyleProps,
  AnnouncementBannerBehaviourProps,
  AnnouncementBannerClasses,
  AnnouncementBannerComponent,
} from './announcement-banner';
export { Avatar, AvatarGroup, AVATAR_AXES, AVATAR_GROUP_AXES } from './avatar';
export type {
  AvatarStyleProps,
  AvatarBehaviourProps,
  AvatarClasses,
  AvatarComponent,
  AvatarGroupStyleProps,
  AvatarGroupBehaviourProps,
  AvatarGroupClasses,
  AvatarGroupComponent,
} from './avatar';
export { Breadcrumb, BreadcrumbItem, BREADCRUMB_AXES } from './breadcrumb';
export type {
  BreadcrumbStyleProps,
  BreadcrumbBehaviourProps,
  BreadcrumbItemProps,
  BreadcrumbClasses,
  BreadcrumbComponent,
  BreadcrumbItemComponent,
} from './breadcrumb';
export { Badge, BADGE_AXES } from './badge';
export type { BadgeStyleProps, BadgeBehaviourProps, BadgeComponent } from './badge';
export { TrustBadge, TRUST_BADGE_AXES } from './trust-badge';
export type {
  TrustBadgeStyleProps,
  TrustBadgeBehaviourProps,
  TrustBadgeComponent,
} from './trust-badge';
export { EmptyState, EMPTY_STATE_AXES } from './empty-state';
export type {
  EmptyStateStyleProps,
  EmptyStateBehaviourProps,
  EmptyStateComponent,
} from './empty-state';
export { BottomBar } from './bottom-bar';
export type { BottomBarBehaviourProps, BottomBarClasses, BottomBarComponent } from './bottom-bar';
export { Divider, DIVIDER_AXES } from './divider';
export type { DividerStyleProps, DividerBehaviourProps, DividerComponent } from './divider';
export { DotLoader, DOT_LOADER_AXES } from './dot-loader';
export type {
  DotLoaderStyleProps,
  DotLoaderBehaviourProps,
  DotLoaderComponent,
} from './dot-loader';
export { ProgressBar, PROGRESS_BAR_AXES } from './progress-bar';
export type {
  ProgressBarStyleProps,
  ProgressBarBehaviourProps,
  ProgressBarComponent,
} from './progress-bar';
export { Skeleton } from './skeleton';
export type { SkeletonBehaviourProps, SkeletonComponent } from './skeleton';
export { Display, DISPLAY_AXES } from './display';
export type { DisplayStyleProps, DisplayBehaviourProps, DisplayComponent } from './display';
export { Code, CODE_AXES } from './code';
export type { CodeStyleProps, CodeBehaviourProps, CodeClasses, CodeComponent } from './code';
export { Heading, HEADING_AXES } from './heading';
export type { HeadingStyleProps, HeadingBehaviourProps, HeadingComponent } from './heading';
export { Text, TEXT_AXES } from './text';
export type { TextStyleProps, TextBehaviourProps, TextComponent } from './text';

// What an app's own components take from Blade besides the components
// above: the provider defaults and the app's services (`adapters`). The
// few runes an app composes on are `@razorpay/blade-svelte/runes`.
export type { FieldChange } from './shared/change';
export { useComponentDefaults } from './defaults';
export { getAdapters } from '../adapters';
