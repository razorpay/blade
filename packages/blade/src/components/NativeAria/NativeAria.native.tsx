import React from 'react';
import { Pressable, Text, View } from 'react-native';
import mapA11yProps from '../../utils/mapProps';
import { CloseIcon, EyeIcon } from '../Icons';
import { useCheckboxA11yProps } from './useCheckboxA11yProps';

const CheckboxItem: React.FC<{ label: string; checked?: boolean; disabled?: boolean }> = ({
  label,
  checked,
  disabled,
}) => {
  const [isChecked, setChecked] = React.useState(checked);
  const checkboxA11yProps = useCheckboxA11yProps({ isDisabled: disabled, isChecked });

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
  return (
    <>
      <Text nativeID="id-group-label">Fruites</Text>
      <View
        {...mapA11yProps({
          accessibilityRole: 'group',
          accessibilityLabelledBy: 'id-group-label',
        })}
      >
        <View accessibilityRole="list">
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
