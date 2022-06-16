import mapA11yProps from '../../utils/mapA11yProps';

type CheckboxA11yProps = { isDisabled?: boolean; isChecked?: boolean };

export const getCheckboxA11yProps = ({
  isDisabled,
  isChecked,
}: CheckboxA11yProps): Record<string, unknown> => {
  return mapA11yProps({
    accessibilityDisabled: isDisabled,
    accessibilityRole: 'checkbox',
    accessibilityChecked: isChecked,
  });
};
