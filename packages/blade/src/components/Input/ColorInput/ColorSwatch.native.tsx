import React from 'react';
import { Pressable, View } from 'react-native';
import type { BaseInputProps } from '~components/Input/BaseInput';
import { useTheme } from '~components/BladeProvider';
import { opacity, size } from '~tokens/global';
import getIn from '~utils/lodashButBetter/get';
import { padHexForPicker } from './ColorInput.utils';

type ColorSwatchProps = {
  color: string;
  size: NonNullable<BaseInputProps['size']>;
  isDisabled?: boolean;
  // eslint-disable-next-line react/no-unused-prop-types -- kept for API consistency with web; native picker not supported
  onChange: (hex: string) => void;
  onPress?: () => void;
};

const swatchSizeTokens = {
  xsmall: size['16'],
  small: size['16'],
  medium: size['20'],
  large: size['24'],
} as const;

/**
 * BaseInput insets the leading interaction element by spacing.2 (4px). The spec places the
 * swatch 8px from the field edge, and 12px at large, so make up the difference here.
 */
const swatchLeftPaddingTokens = {
  xsmall: 2,
  small: 2,
  medium: 2,
  large: 3,
} as const;

const ColorSwatch = ({
  color,
  size: inputSize,
  isDisabled,
  onChange: _onChange,
  onPress,
}: ColorSwatchProps): React.ReactElement => {
  const dimension = swatchSizeTokens[inputSize];
  const { theme } = useTheme();
  const borderColor = getIn(theme.colors, 'interactive.border.gray.default');

  const handlePress = (): void => {
    onPress?.();
    if (__DEV__) {
      console.warn(
        '[Blade ColorInput]: Native color picker is not supported. The swatch is display-only on React Native.',
      );
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={isDisabled}
      style={{ paddingLeft: theme.spacing[swatchLeftPaddingTokens[inputSize]] }}
    >
      <View
        style={{
          width: dimension,
          height: dimension,
          backgroundColor: padHexForPicker(color),
          borderRadius: theme.border.radius.xsmall,
          borderWidth: theme.border.width.thin,
          borderColor,
          opacity: isDisabled ? opacity['500'] : 1,
        }}
      />
    </Pressable>
  );
};

export { ColorSwatch };
