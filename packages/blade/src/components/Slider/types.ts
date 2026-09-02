import type { BaseInputProps } from '~components/Input/BaseInput';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import type { DataAnalyticsAttribute } from '~utils/types';

type SliderBaseProps = Pick<
  BaseInputProps,
  'labelPosition' | 'name' | 'isDisabled' | 'testID' | keyof DataAnalyticsAttribute
> & {
  onFocus?: (args: { name?: string; value: number }) => void;
  onBlur?: (args: { name?: string; value: number }) => void;
  /**
   * The numerical value of the slider. Passing `value` puts the component in controlled mode.
   */
  value?: number;
  /**
   * The default numerical value when the component is uncontrolled.
   */
  defaultValue?: number;
  /** @default 0 */
  min?: number;
  /** @default 100 */
  max?: number;
  /** @default 1 */
  step?: number;
  /**
   * Unit label appended to the value in the value tooltip and the accessible
   * value text (e.g. 'px', '%', 'rem').
   * @note v1 only supports a trailing suffix. A leading prefix (e.g. '$') is a known
   * omission and may be added in a future release.
   */
  suffix?: string;
  /** @default 'medium' */
  size?: 'medium' | 'large';
  /**
   * Shows the value tooltip above the thumb while it is hovered, dragged, or
   * keyboard-focused. The tooltip is the slider's value readout — disable it only
   * when the consuming surface renders its own readout next to the slider.
   *
   * @default true
   */
  showTooltip?: boolean;
  /**
   * Renders the track as step segments — a small gap at each step position —
   * to visually communicate that the slider snaps to discrete values.
   * The filled portion of the track stays solid.
   *
   * When the steps are too dense for the gaps to be discernible (each step
   * block narrower than ~8px on screen), the segments auto-hide and the track
   * renders continuous — mirroring Material's tick auto-hide guidance.
   *
   * @default false
   */
  showSteps?: boolean;
  onChangeStart?: (args: { name?: string; value: number }) => void;
  onChangeEnd?: (args: { name?: string; value: number }) => void;
  /**
   * onChange fires on every value change, including continuously during drag.
   *
   * Note: Unlike most Blade inputs where `onChange` fires only on committed values,
   * this `onChange` fires in real-time as the slider moves. Use `onChangeEnd` for
   * performance-critical scenarios where you only need the final committed value.
   *
   * All value callbacks (`onChange`, `onChangeStart`, `onChangeEnd`, `onFocus`, `onBlur`)
   * report `{ name, value }`. `value` is a `number` — an intentional deviation from the
   * string-based `FormInputOnEvent` shape, since the slider models a numeric value.
   */
  onChange?: (args: { name?: string; value: number }) => void;
} & StyledPropsBlade;

type SliderPropsWithLabel = {
  /**
   * Label describing the value being controlled.
   * When provided, this is used for both the visible label and the accessible name.
   */
  label: string;
  /**
   * Accessible name for the slider — optional override when `label` is provided.
   */
  accessibilityLabel?: string;
};

type SliderPropsWithA11yLabel = {
  /**
   * Label describing the value being controlled — absent when using `accessibilityLabel`.
   */
  label?: undefined;
  /**
   * Accessible name for the slider — required when `label` is not provided.
   */
  accessibilityLabel: string;
};

export type SliderProps = (SliderPropsWithLabel | SliderPropsWithA11yLabel) & SliderBaseProps;
