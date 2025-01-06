import type { MotionMetaProp } from '~components/BaseMotion';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import type { DataAnalyticsAttribute, TestID } from '~utils/types';

type OnChange = ({
  isChecked,
  value,
  event,
}: {
  isChecked: boolean;
  event?: React.ChangeEvent;
  value?: string;
}) => void;

type SwitchProps = {
  /**
   * If `true`, The switch will be checked. This also makes the switch controlled
   * Use `onChange` to update its value
   *
   * @default false
   */
  isChecked?: boolean;
  /**
   * If `true`, the switch will be initially checked. This also makes the switch uncontrolled
   *
   * @default false
   */
  defaultChecked?: boolean;
  /**
   * The callback invoked when the checked state of the `Switch` changes.
   */
  onChange?: OnChange;
  /**
   * The name of the input field in a switch
   * (Useful for form submission).
   */
  name?: string;
  /**
   * The value to be used in the switch input.
   * This is the value that will be returned on form submission.
   */
  value?: string;
  /**
   * If `true`, the switch will be disabled
   *
   * @default false
   */
  isDisabled?: boolean;
  /**
   * Size of the switch
   *
   * @default "medium"
   */
  size?: 'small' | 'medium';
  /**
   * Provides accessible label for internal checkbox component that sets the aria-label prop for screen readers.
   */
  accessibilityLabel: string;
  /**
   * The id of the input field in a switch, useful for associating a label element with the input via htmlFor prop
   */
  id?: string;
} & TestID &
  DataAnalyticsAttribute &
  StyledPropsBlade &
  MotionMetaProp;

type ThumbProps = {
  children: React.ReactNode;
  deviceType: 'mobile' | 'desktop';
} & Pick<SwitchProps, 'isChecked' | 'size'>;

type AnimatedThumbProps = Pick<SwitchProps, 'size' | 'isChecked' | 'isDisabled'> & {
  children: React.ReactNode;
  isPressed?: boolean;
};

type TrackProps = Required<Pick<SwitchProps, 'size' | 'isDisabled' | 'isChecked'>> & {
  deviceType: 'mobile' | 'desktop';
};

export type { OnChange, SwitchProps, ThumbProps, AnimatedThumbProps, TrackProps };
