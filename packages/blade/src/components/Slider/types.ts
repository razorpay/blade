import type { MotionMetaProp } from '~components/BaseMotion';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import type { FeedbackColors } from '~tokens/theme/theme';
import type { DataAnalyticsAttribute, TestID } from '~utils/types';

type SliderRangeValue = readonly [number, number];
type SliderValue = number | SliderRangeValue;

type SliderMark = {
  /** Numeric position of the mark. */
  value: number;
  /** Optional text rendered below the mark. */
  label?: string;
};

type SliderChangeHandler<TValue extends SliderValue> = (args: {
  name?: string;
  value: TValue;
}) => void;

type SliderLabelProps =
  | {
      /** Visible label describing the value controlled by the slider. */
      label: string;
      /** Optional accessible label override. */
      accessibilityLabel?: string;
    }
  | {
      label?: undefined;
      /** Required when no visible label is provided. */
      accessibilityLabel: string;
    };

type SliderCommonProps = {
  /** @default 0 */
  min?: number;
  /** @default 100 */
  max?: number;
  /** @default 1 */
  step?: number;
  /** @default 'medium' */
  size?: 'small' | 'medium' | 'large';
  /** @default 'information' */
  color?: FeedbackColors;
  /** Shows the current value beside the label. @default true */
  showValue?: boolean;
  /** Overrides the value shown beside the label. */
  valueText?: string;
  /** Shows the current value above each thumb. @default false */
  showThumbValue?: boolean;
  /** Formats generated value labels and aria-valuetext. */
  valueFormatter?: (value: number) => string;
  /** Shows step marks or the marks supplied through `marks`. @default false */
  showMarks?: boolean;
  /** Custom marks. When omitted, up to 20 step marks are generated. */
  marks?: SliderMark[];
  /** Shows the minimum and maximum labels below the track. @default false */
  showMinMax?: boolean;
  /** Overrides the generated minimum label. */
  minLabel?: string;
  /** Overrides the generated maximum label. */
  maxLabel?: string;
  /** Helpful guidance shown below the slider. */
  helpText?: string;
  /** Error message shown when `validationState` is `error`. */
  errorText?: string;
  /** @default 'none' */
  validationState?: 'none' | 'error';
  /** @default false */
  isDisabled?: boolean;
  /** Name included in change callbacks and native form submission. */
  name?: string;
} & TestID &
  DataAnalyticsAttribute &
  StyledPropsBlade &
  MotionMetaProp;

type SingleSliderProps = {
  /** @default 'single' */
  variant?: 'single';
  value?: number;
  defaultValue?: number;
  onChange?: SliderChangeHandler<number>;
  /** Called when pointer or keyboard interaction commits a value. */
  onChangeEnd?: SliderChangeHandler<number>;
};

type RangeSliderProps = {
  variant: 'range';
  value?: SliderRangeValue;
  defaultValue?: SliderRangeValue;
  onChange?: SliderChangeHandler<SliderRangeValue>;
  /** Called when pointer or keyboard interaction commits a value. */
  onChangeEnd?: SliderChangeHandler<SliderRangeValue>;
};

type SliderProps = SliderLabelProps & SliderCommonProps & (SingleSliderProps | RangeSliderProps);

export type { SliderChangeHandler, SliderMark, SliderProps, SliderRangeValue, SliderValue };
