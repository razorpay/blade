type OnChange = ({
  isChecked,
  event,
  value,
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
  accessibilityLabel?: string;
  id?: string;
};

type ThumbProps = {
  children: React.ReactNode;
  deviceType: 'mobile' | 'desktop';
} & Pick<SwitchProps, 'isChecked' | 'size'>;

export type { OnChange, SwitchProps, ThumbProps };
