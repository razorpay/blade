import makeAccessible from '../../utils/makeAccessible';

type CheckboxA11yProps = { isDisabled?: boolean; isChecked?: boolean };

export const getCheckboxA11yProps = ({
  isDisabled,
  isChecked,
}: CheckboxA11yProps): Record<string, unknown> => {
  return makeAccessible({
    disabled: isDisabled,
    role: 'checkbox',
    checked: isChecked,
  });
};
