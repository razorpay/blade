import React from 'react';
import { Pressable, Text, View } from 'react-native';
import mapA11yProps from '../../utils/mapProps';

const CheckboxItem: React.FC<{ label: string; checked?: boolean }> = ({ label, checked }) => {
  const [isChecked, setChecked] = React.useState(checked);

  return (
    <>
      <Text>{isChecked ? 'X' : '0'}</Text>
      <Pressable
        onPress={(): void => setChecked((prev) => !prev)}
        {...mapA11yProps({
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
            <CheckboxItem label="Apple" />
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
