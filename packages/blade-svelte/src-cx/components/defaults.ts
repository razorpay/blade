// What BladeProvider can default, per component: each component's style
// props by name, and the size scale of the controls that follow the
// provider's overall `size`. Behaviour props are not here — a provider sets
// how things look, never what they do.
import { useDefaults } from '../runes/defaults/defaults.svelte';
import type { Defaults } from '../runes/defaults/defaults.svelte';
import type { Responsive, ResponsiveProps } from '../runes/defaults/responsive';
import type { CardGroupStyleProps } from './card-group/styles';
import type { AlertStyleProps } from './alert/styles';
import type { AmountStyleProps } from './amount/styles';
import type { BadgeStyleProps } from './badge/styles';
import type { BottomSheetStyleProps } from './bottom-sheet/styles';
import type { DrawerStyleProps } from './drawer/styles';
import type { ButtonGroupStyleProps } from './button-group/styles';
import { BUTTON_AXES } from './button/styles';
import type { ButtonStyleProps } from './button/styles';
import type { CardStyleProps } from './card/styles';
import type { CarouselStyleProps } from './carousel/styles';
import { CHECKBOX_AXES } from './checkbox/styles';
import type { CheckboxStyleProps } from './checkbox/styles';
import { CHIP_GROUP_AXES } from './chip/styles';
import type { ChipGroupStyleProps } from './chip/styles';
import type { CountdownStyleProps } from './countdown/styles';
import { COUNTER_INPUT_AXES } from './counter-input/styles';
import type { CounterInputStyleProps } from './counter-input/styles';
import type { CounterStyleProps } from './counter/styles';
import type { DividerStyleProps } from './divider/styles';
import type { EmptyStateStyleProps } from './empty-state/styles';
import { ICON_BUTTON_AXES } from './icon-button/styles';
import type { IconButtonStyleProps } from './icon-button/styles';
import type { IconStyleProps } from './icon/styles';
import type { InputGroupStyleProps } from './input-group/styles';
import { LINK_AXES } from './link/styles';
import type { LinkStyleProps } from './link/styles';
import type { ModalStyleProps } from './modal/styles';
import type { OptionListStyleProps } from './option-list/styles';
import { OTP_INPUT_AXES } from './otp-input/styles';
import type { OTPInputStyleProps } from './otp-input/styles';
import type { PhoneNumberInputStyleProps } from './phone-number-input/styles';
import type { PopoverStyleProps } from './popover/styles';
import type { ProgressStyleProps } from './progress/styles';
import { RADIO_GROUP_AXES } from './radio/styles';
import type { RadioGroupStyleProps } from './radio/styles';
import { SEGMENTED_CONTROL_AXES } from './segmented-control/styles';
import type { SegmentedControlStyleProps } from './segmented-control/styles';
import type { HeadingStyleProps, TextStyleProps } from './shared/typography';
import { SWITCH_AXES } from './switch/styles';
import type { SwitchStyleProps } from './switch/styles';
import { TABS_AXES } from './tabs/styles';
import type { TabsStyleProps } from './tabs/styles';
import type { TextAreaStyleProps } from './text-area/styles';
import { TEXT_INPUT_AXES } from './text-input/styles';
import { TEXT_AREA_AXES } from './text-area/styles';
import { PHONE_NUMBER_INPUT_AXES } from './phone-number-input/styles';
import { INPUT_GROUP_AXES } from './input-group/styles';
import type { TextInputStyleProps } from './text-input/styles';
import type { ToastStyleProps } from './toast/styles';
import type { TooltipStyleProps } from './tooltip/styles';

/** Every component a provider can default, by name, with its style props. */
export interface ComponentStyleProps {
  CardGroup: CardGroupStyleProps;
  Alert: AlertStyleProps;
  Amount: AmountStyleProps;
  Badge: BadgeStyleProps;
  BottomSheet: BottomSheetStyleProps;
  Button: ButtonStyleProps;
  ButtonGroup: ButtonGroupStyleProps;
  Card: CardStyleProps;
  Carousel: CarouselStyleProps;
  Checkbox: CheckboxStyleProps;
  ChipGroup: ChipGroupStyleProps;
  Countdown: CountdownStyleProps;
  Counter: CounterStyleProps;
  CounterInput: CounterInputStyleProps;
  Divider: DividerStyleProps;
  Drawer: DrawerStyleProps;
  EmptyState: EmptyStateStyleProps;
  Heading: HeadingStyleProps;
  Icon: IconStyleProps;
  IconButton: IconButtonStyleProps;
  InputGroup: InputGroupStyleProps;
  Link: LinkStyleProps;
  Modal: ModalStyleProps;
  OptionList: OptionListStyleProps;
  OTPInput: OTPInputStyleProps;
  PhoneNumberInput: PhoneNumberInputStyleProps;
  Popover: PopoverStyleProps;
  Progress: ProgressStyleProps;
  RadioGroup: RadioGroupStyleProps;
  SegmentedControl: SegmentedControlStyleProps;
  Switch: SwitchStyleProps;
  Tabs: TabsStyleProps;
  Text: TextStyleProps;
  TextArea: TextAreaStyleProps;
  TextInput: TextInputStyleProps;
  Toast: ToastStyleProps;
  Tooltip: TooltipStyleProps;
}

export type ComponentName = keyof ComponentStyleProps;

/** Per component: any of its style props, each optionally per breakpoint. */
export type ComponentDefaults = {
  [K in ComponentName]?: {
    [P in keyof ComponentStyleProps[K]]?: Responsive<Exclude<ComponentStyleProps[K][P], undefined>>;
  };
};

/** The sizes an overall `size` can be; each control snaps to its own scale. */
export type DefaultSize = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';

/**
 * The controls whose size is density, and their scales: they follow the
 * provider's overall `size`. Display components (Badge, Counter, Icon,
 * Text…) and the overlays, whose `size` is a width, keep their own.
 */
export const SIZED_CONTROLS: Partial<Record<ComponentName, readonly string[]>> = {
  Button: BUTTON_AXES.size,
  IconButton: ICON_BUTTON_AXES.size,
  Link: LINK_AXES.size,
  TextInput: TEXT_INPUT_AXES.size,
  TextArea: TEXT_AREA_AXES.size,
  PhoneNumberInput: PHONE_NUMBER_INPUT_AXES.size,
  InputGroup: INPUT_GROUP_AXES.size,
  OTPInput: OTP_INPUT_AXES.size,
  CounterInput: COUNTER_INPUT_AXES.size,
  Checkbox: CHECKBOX_AXES.size,
  RadioGroup: RADIO_GROUP_AXES.size,
  ChipGroup: CHIP_GROUP_AXES.size,
  Switch: SWITCH_AXES.size,
  SegmentedControl: SEGMENTED_CONTROL_AXES.size,
  Tabs: TABS_AXES.size,
};

/**
 * A component's style props with the providers' defaults filled in (see
 * `useDefaults`). Call during component init.
 */
export function useComponentDefaults<K extends ComponentName>(
  name: K,
  props: () => ResponsiveProps<ComponentStyleProps[K]>,
): Defaults<ComponentStyleProps[K]> {
  return useDefaults(name, props as () => ComponentStyleProps[K], { sizes: SIZED_CONTROLS[name] });
}
