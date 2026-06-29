import React from 'react';
import { Pressable, View } from 'react-native';
import type { BaseInputProps } from '~components/Input/BaseInput';
import { useTheme } from '~components/BladeProvider';
import { size } from '~tokens/global';
import getIn from '~utils/lodashButBetter/get';
import { padHexForPicker } from './ColorInput.utils';

type ColorSwatchProps = {
  color: string;
  size: NonNullable<BaseInputProps['size']>;
  isDisabled?: boolean;
  onChange: (hex: string) => void;
};

const swatchSizeTokens = {
  xsmall: size['20'],
  small: size['24'],
  medium: size['28'],
  large: size['40'],
} as const;

const ColorSwatch = ({
  color,
  size: inputSize,
  isDisabled,
}: ColorSwatchProps): React.ReactElement => {
  const dimension = swatchSizeTokens[inputSize];
  const { theme } = useTheme();
  const borderColor = getIn(theme.colors, 'interactive.border.gray.default');

  const handlePress = (): void => {
    if (__DEV__) {
      console.warn(
        '[Blade ColorInput]: Native color picker is not supported. The swatch is display-only on React Native.',
      );
    }
  };

  return (
    <Pressable onPress={handlePress} disabled={isDisabled}>
      <View
        style={{
          width: dimension,
          height: dimension,
          backgroundColor: padHexForPicker(color),
          borderRadius: theme.border.radius.xsmall,
          borderWidth: theme.border.width.thin,
          borderColor,
          opacity: isDisabled ? 0.5 : 1,
        }}
      />
    </Pressable>
  );
};

export { ColorSwatch };
