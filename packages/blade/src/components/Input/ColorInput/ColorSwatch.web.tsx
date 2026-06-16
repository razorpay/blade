import React, { useRef } from 'react';
import BaseBox from '~components/Box/BaseBox';
import type { BaseInputProps } from '~components/Input/BaseInput';

type ColorSwatchProps = {
  color: string;
  size: NonNullable<BaseInputProps['size']>;
  isDisabled?: boolean;
  onChange: (hex: string) => void;
};

const swatchSize = {
  xsmall: 16,
  small: 16,
  medium: 20,
  large: 24,
} as const;

const ColorSwatch = ({
  color,
  size,
  isDisabled,
  onChange,
}: ColorSwatchProps): React.ReactElement => {
  const colorInputRef = useRef<HTMLInputElement>(null);

  const handleClick = (): void => {
    if (!isDisabled) {
      colorInputRef.current?.click();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const hexValue = e.target.value.replace('#', '').toUpperCase();
    onChange(hexValue);
  };

  const dimension = swatchSize[size];

  return (
    <BaseBox
      display="flex"
      alignItems="center"
      justifyContent="center"
      onClick={handleClick}
      cursor={isDisabled ? 'not-allowed' : 'pointer'}
    >
      <BaseBox
        as="div"
        style={{
          width: `${dimension}px`,
          height: `${dimension}px`,
          backgroundColor: `#${color || 'FFFFFF'}`,
          borderRadius: '4px',
          border: '1px solid',
          borderColor: 'hsla(0, 0%, 0%, 0.12)',
          flexShrink: 0,
          opacity: isDisabled ? 0.5 : 1,
        }}
      />
      <input
        ref={colorInputRef}
        type="color"
        value={`#${color || 'FFFFFF'}`}
        onChange={handleChange}
        disabled={isDisabled}
        tabIndex={-1}
        aria-hidden="true"
        style={{
          position: 'absolute',
          width: 0,
          height: 0,
          opacity: 0,
          overflow: 'hidden',
          pointerEvents: 'none',
        }}
      />
    </BaseBox>
  );
};

export { ColorSwatch };
