type ButtonGroupProps = {
  /**
   * Accepts multiple Button components as children
   */
  children: React.ReactNode;
  /**
   * Specifies the visual style variant of the ButtonGroup.
   *
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary' | 'tertiary';
  /**
   * Specifies the size of the ButtonGroup.
   *
   * @default 'medium'
   */
  size?: 'xsmall' | 'small' | 'medium' | 'large';
  /**
   * Specifies whether the ButtonGroup should take up the full width of its container.
   */
  isFullWidth?: boolean;
  /**
   * Disables or enables the ButtonGroup component
   *
   * @default false
   */
  isDisabled?: boolean;
  /**
   * Test ID for automation
   */
  testID?: string;
};

type StyledButtonGroupProps = {
  isDisabled?: boolean;
};

export type { ButtonGroupProps, StyledButtonGroupProps };
