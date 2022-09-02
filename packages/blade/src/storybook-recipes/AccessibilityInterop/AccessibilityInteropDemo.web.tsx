import React from 'react';
import { getCheckboxAccessibilityProps } from './getCheckboxA11yProps';
import { makeAccessible } from '~utils';
import { CloseIcon, EyeIcon } from '~components/Icons';
import Box from '~components/Box';
import { useTheme } from '~components/BladeProvider';

const Checkbox: React.FC<{ label: string; checked?: boolean; disabled?: boolean }> = ({
  label,
  checked,
  disabled,
}) => {
  const { theme } = useTheme();
  const [isChecked, setChecked] = React.useState(checked);
  const checkboxAccessibilityProps = getCheckboxAccessibilityProps({
    isDisabled: disabled,
    isChecked,
  });

  const toggleChecked = (): void => {
    if (disabled) return;
    setChecked((prev) => !prev);
  };

  const handleOnKeyDown = (event: React.KeyboardEvent): void => {
    if (event.key === ' ') toggleChecked();
  };

  return (
    <Box display="flex" alignItems="center" gap="spacing.3">
      {isChecked ? (
        <EyeIcon color="action.icon.link.active" size="medium" />
      ) : (
        <CloseIcon color="action.icon.link.active" size="medium" />
      )}
      <Box
        onKeyDown={handleOnKeyDown}
        onClick={toggleChecked}
        {...checkboxAccessibilityProps}
        tabIndex={0}
        style={{
          color: disabled
            ? theme.colors.action.text.primary.disabled
            : theme.colors.surface.text.normal.lowContrast,
        }}
      >
        {label}
      </Box>
    </Box>
  );
};

const AccessibilityInteropDemo = (): React.ReactElement => {
  const checkboxGroupA11y = makeAccessible({
    role: 'group',
    labelledBy: 'id-group-label',
  });

  return (
    <>
      <h3 id="id-group-label">Fruits</h3>
      <Box marginBottom="spacing.2" />
      <div {...checkboxGroupA11y}>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          <li>
            <Checkbox checked label="Mango" />
          </li>
          <li>
            <Checkbox disabled label="Apple" />
          </li>
          <li>
            <Checkbox label="Banana" />
          </li>
        </ul>
      </div>
    </>
  );
};

export default AccessibilityInteropDemo;
