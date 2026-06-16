import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import BaseBox from '~components/Box/BaseBox';
import type { BaseInputProps } from '~components/Input/BaseInput';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

type ColorSwatchProps = {
  color: string;
  size: NonNullable<BaseInputProps['size']>;
  isDisabled?: boolean;
  onChange: (hex: string) => void;
};

type ColorSwatchRef = {
  openPicker: () => void;
};

const swatchSize = {
  xsmall: 20,
  small: 24,
  medium: 28,
  large: 40,
} as const;

const swatchMarginRight = {
  xsmall: 0,
  small: 0,
  medium: -2,
  large: -4,
} as const;

const _ColorSwatch = forwardRef<ColorSwatchRef, ColorSwatchProps>(
  ({ color, size, isDisabled, onChange }, ref) => {
    const colorInputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
      openPicker: () => {
        if (!isDisabled) {
          colorInputRef.current?.click();
        }
      },
    }));

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
        position="relative"
        onClick={handleClick}
        cursor={isDisabled ? 'not-allowed' : 'pointer'}
        style={{ marginRight: `${swatchMarginRight[size]}px` }}
      >
        <BaseBox
          as="div"
          style={{
            width: `${dimension}px`,
            height: `${dimension}px`,
            backgroundColor: `#${color || 'FFFFFF'}`,
            borderRadius: '6px',
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
            top: '100%',
            left: 0,
            width: 0,
            height: 0,
            opacity: 0,
            overflow: 'hidden',
            pointerEvents: 'none',
          }}
        />
      </BaseBox>
    );
  },
);

const ColorSwatch = assignWithoutSideEffects(_ColorSwatch, {
  displayName: 'ColorSwatch',
});

export { ColorSwatch };
export type { ColorSwatchRef };
