import React from 'react';
import { Pressable, Text, View } from 'react-native';
import mapA11yProps from '../../utils/mapProps';
import { CloseIcon, EyeIcon } from '../Icons';

const CheckboxItem: React.FC<{ label: string; checked?: boolean; disabled?: boolean }> = ({
  label,
  checked,
  disabled,
}) => {
  const [isChecked, setChecked] = React.useState(checked);

  const toggleChecked = (): void => {
    if (disabled) return;
    setChecked((prev) => !prev);
  };

  return (
    <>
      {isChecked ? (
        <EyeIcon color="action.icon.link.active" size="small" />
      ) : (
        <CloseIcon color="action.icon.link.active" size="small" />
      )}
      <Pressable
        onPress={toggleChecked}
        {...mapA11yProps({
          accessibilityDisabled: disabled,
          accessibilityRole: 'checkbox',
          accessibilityChecked: isChecked ? 'true' : 'false',
        })}
        focusable
      >
        <Text>{label}</Text>
      </Pressable>
    </>
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
