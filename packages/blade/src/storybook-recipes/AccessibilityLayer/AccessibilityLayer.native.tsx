import React from 'react';
import { Pressable, Text, View } from 'react-native';
import makeAccessible from '../../utils/makeAccessible';
import { CloseIcon, EyeIcon } from '../../components/Icons';
import { getCheckboxA11yProps } from './getCheckboxA11yProps';

const CheckboxItem: React.FC<{ label: string; checked?: boolean; disabled?: boolean }> = ({
  label,
  checked,
  disabled,
}) => {
  const [isChecked, setChecked] = React.useState(checked);
  const checkboxA11yProps = getCheckboxA11yProps({ isDisabled: disabled, isChecked });

  const toggleChecked = (): void => {
    if (disabled) return;
    setChecked((prev) => !prev);
  };

  return (
    <View>
      {isChecked ? (
        <EyeIcon color="action.icon.link.active" size="small" />
      ) : (
        <CloseIcon color="action.icon.link.active" size="small" />
      )}
      <Pressable onPress={toggleChecked} {...checkboxA11yProps} focusable>
        <Text>{label}</Text>
      </Pressable>
    </View>
  );
};

const NativeAria = (): React.ReactElement => {
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

export default NativeAria;
