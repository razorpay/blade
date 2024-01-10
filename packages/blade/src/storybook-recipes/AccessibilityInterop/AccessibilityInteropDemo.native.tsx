import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { getCheckboxAccessibilityProps } from './getCheckboxA11yProps';
import { CloseIcon, EyeIcon } from '~components/Icons';
import BaseBox from '~components/Box/BaseBox';
import { makeAccessible } from '~utils/makeAccessible';

const CheckboxItem: React.FC<{ label: string; checked?: boolean; disabled?: boolean }> = ({
  label,
  checked,
  disabled,
}) => {
  const [isChecked, setChecked] = React.useState(checked);
  const checkboxAccessibilityProps = getCheckboxAccessibilityProps({
    isDisabled: disabled,
    isChecked,
  });

  const toggleChecked = (): void => {
    if (disabled) return;
    setChecked((prev) => !prev);
  };

  return (
    <BaseBox display="flex" alignItems="center" flexDirection="row" gap="spacing.3">
      {isChecked ? (
        <EyeIcon color="action.icon.link.active" size="small" />
      ) : (
        <CloseIcon color="action.icon.link.active" size="small" />
      )}
      <Pressable onPress={toggleChecked} {...checkboxAccessibilityProps} focusable>
        <Text>{label}</Text>
      </Pressable>
    </BaseBox>
  );
};

const AccessibilityInteropDemo = (): React.ReactElement => {
  const checkboxGroupA11y = makeAccessible({
    role: 'group',
    labelledBy: 'id-group-label',
  });

  return (
    <>
      <Text nativeID="id-group-label">Fruits</Text>
      <View {...checkboxGroupA11y}>
        <View {...makeAccessible({ role: 'list' })}>
          <View>
            <CheckboxItem checked label="Mango" />
          </View>
          <View>
            <CheckboxItem disabled label="Apple" />
          </View>
          <View>
            <CheckboxItem label="Banana" />
          </View>
        </View>
      </View>
    </>
  );
};

export default AccessibilityInteropDemo;
