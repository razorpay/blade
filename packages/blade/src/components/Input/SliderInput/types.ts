import type { BaseInputProps } from '~components/Input/BaseInput';
import type { FormInputLabelProps, FormInputValidationProps } from '~components/Form';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import type { DataAnalyticsAttribute } from '~utils/types';
import type { MotionMetaProp } from '~components/BaseMotion';

type SliderInputProps = Pick<
  FormInputLabelProps,
  'label' | 'labelPosition' | 'necessityIndicator'
> &
  // `validationTextPlacement: 'inside'` has no meaning here: the slider has no field box to
  // render text inside of.
  Omit<FormInputValidationProps, 'validationTextPlacement'> &
  Pick<
    BaseInputProps,
    | 'name'
    | 'onFocus'
    | 'onBlur'
    | 'isDisabled'
    | 'isRequired'
    | 'accessibilityLabel'
    | 'testID'
    | keyof DataAnalyticsAttribute
  > & {
    /**
     * The value of the slider, in controlled mode.
     *
     * Always snapped to `step` before it is rendered, so a value that does not sit on a step
     * will move the thumb to the nearest one.
     */
    value?: number;

    /**
     * The initial value when the slider is uncontrolled.
     */
    defaultValue?: number;

    /**
     * Called on every change, including each pointer move during a drag.
     *
     * Bind live display to this. For anything expensive, use `onChangeEnd` instead.
     */
    onChange?: (args: { value: number }) => void;

    /**
     * Called once when an interaction commits: on pointer release, or on the key up of a
     * keyboard adjustment. Use this for network calls and other expensive work.
     */
    onChangeEnd?: (args: { value: number }) => void;

    /**
     * Lowest selectable value.
     *
     * @default 0
     */
    min?: number;

    /**
     * Highest selectable value. Always reachable, even when it is not a whole number of
     * `step`s away from `min`.
     *
     * @default 100
     */
    max?: number;

    /**
     * The increment between selectable values. This is a step size, not a number of steps:
     * `step={10}` over 0-100 gives 11 selectable values.
     *
     * @default 1
     */
    step?: number;

    /**
     * Shows tick markers on the track, one per step.
     *
     * Markers are dropped automatically when the track is too narrow to space them out.
     *
     * @default false
     */
    showMarkers?: boolean;

    /**
     * Shows a row of value labels beneath the track.
     *
     * @default false
     */
    showScale?: boolean;

    /**
     * When false, the scale renders only `min` and `max` rather than a label per step.
     *
     * @default true
     */
    showScaleValues?: boolean;

    /**
     * Formats the value wherever it is displayed: the scale labels, the value indicator and
     * `aria-valuetext`.
     */
    formatValue?: (value: number) => string;

    /**
     * Shows a readout above the thumb on hover, focus and drag.
     *
     * @default true
     */
    showValueIndicator?: boolean;
  } & StyledPropsBlade &
  MotionMetaProp;

export type { SliderInputProps };
