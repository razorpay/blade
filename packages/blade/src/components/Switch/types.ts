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
   * If `true`, The checkbox will be checked. This also makes the checkbox controlled
   * Use `onChange` to update its value
   *
   * @default false
   */
  isChecked?: boolean;
  /**
   * If `true`, the checkbox will be initially checked. This also makes the checkbox uncontrolled
   *
   * @default false
   */
  defaultChecked?: boolean;
  /**
   * The callback invoked when the checked state of the `Checkbox` changes.
   */
  onChange?: OnChange;
  /**
   * The name of the input field in a checkbox
   * (Useful for form submission).
   */
  name?: string;
  /**
   * The value to be used in the checkbox input.
   * This is the value that will be returned on form submission.
   */
  value?: string;
  /**
   * If `true`, the checkbox will be disabled
   *
   * @default false
   */
  isDisabled?: boolean;
  /**
   * Size of the checkbox
   *
   * @default "medium"
   */
  size?: 'small' | 'medium';
  /**
   * Provides accessible label for internal checkbox component that sets the aria-label prop for screen readers.
   */
  accessibilityLabel?: string;
  /**
   * The id of the input field in a switch, useful for associating a label element with the input via htmlFor prop
   */
  id?: string;
  testID?: string;
};

type ThumbProps = {
  children: React.ReactNode;
  deviceType: 'mobile' | 'desktop';
} & Pick<SwitchProps, 'isChecked' | 'size'>;

type AnimatedThumbProps = Pick<SwitchProps, 'size' | 'isChecked' | 'isDisabled'> & {
  children: React.ReactNode;
  // eslint-disable-next-line react/no-unused-prop-types
  shouldRunAnimation?: boolean;
};

export type { OnChange, SwitchProps, ThumbProps, AnimatedThumbProps };
