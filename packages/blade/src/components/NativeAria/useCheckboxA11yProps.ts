import mapA11yProps from '../../utils/mapProps';

type CheckboxA11yProps = { isDisabled?: boolean; isChecked?: boolean };

export const useCheckboxA11yProps = ({
  isDisabled,
  isChecked,
}: CheckboxA11yProps): Record<string, unknown> => {
  return mapA11yProps({
    accessibilityDisabled: isDisabled,
    accessibilityRole: 'checkbox',
    accessibilityChecked: isChecked ? 'true' : 'false',
  });
};
