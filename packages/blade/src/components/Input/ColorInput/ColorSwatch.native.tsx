import React from 'react';
import { View } from 'react-native';
import type { BaseInputProps } from '~components/Input/BaseInput';

type ColorSwatchProps = {
  color: string;
  size: NonNullable<BaseInputProps['size']>;
  isDisabled?: boolean;
  onChange: (hex: string) => void;
};

const swatchSize = {
  xsmall: 20,
  small: 24,
  medium: 28,
  large: 36,
} as const;

const ColorSwatch = ({
  color,
  size,
  isDisabled,
  onChange: _onChange,
}: ColorSwatchProps): React.ReactElement => {
  const dimension = swatchSize[size];

  return (
    <View
      style={{
        width: dimension,
        height: dimension,
        backgroundColor: `#${color || 'FFFFFF'}`,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.12)',
        opacity: isDisabled ? 0.5 : 1,
      }}
    />
  );
};

export { ColorSwatch };
