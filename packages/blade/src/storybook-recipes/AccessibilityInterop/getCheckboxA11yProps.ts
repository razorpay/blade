import { makeAccessible } from '~utils';

type CheckboxAccessibilityProps = { isDisabled?: boolean; isChecked?: boolean };

export const getCheckboxAccessibilityProps = ({
  isDisabled,
  isChecked,
}: CheckboxAccessibilityProps): Record<string, unknown> => {
  return makeAccessible({
    disabled: isDisabled,
    role: 'checkbox',
    checked: isChecked,
  });
};
