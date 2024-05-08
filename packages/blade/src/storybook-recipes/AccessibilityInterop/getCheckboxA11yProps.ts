import { makeAccessible } from '~utils/makeAccessible';

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
