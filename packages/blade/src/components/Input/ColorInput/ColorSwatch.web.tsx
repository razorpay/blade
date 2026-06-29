import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import BaseBox from '~components/Box/BaseBox';
import type { BaseInputProps } from '~components/Input/BaseInput';
import { useTheme } from '~components/BladeProvider';
import { makeSize } from '~utils/makeSize';
import { size } from '~tokens/global';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { padHexForPicker } from './ColorInput.utils';
import getIn from '~utils/lodashButBetter/get';

type ColorSwatchProps = {
  color: string;
  size: NonNullable<BaseInputProps['size']>;
  isDisabled?: boolean;
  onChange: (hex: string) => void;
};

type ColorSwatchRef = {
  openPicker: () => void;
};

const swatchSizeTokens = {
  xsmall: size['20'],
  small: size['24'],
  medium: size['28'],
  large: size['40'],
} as const;

const _ColorSwatch = forwardRef<ColorSwatchRef, ColorSwatchProps>(
  ({ color, size: inputSize, isDisabled, onChange }, ref) => {
    const colorInputRef = useRef<HTMLInputElement>(null);
    const { theme } = useTheme();
    const borderColor = getIn(theme.colors, 'interactive.border.gray.default');

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

    const dimension = swatchSizeTokens[inputSize];

    return (
      <BaseBox
        display="flex"
        alignItems="center"
        justifyContent="center"
        position="relative"
        onClick={handleClick}
        cursor={isDisabled ? 'not-allowed' : 'pointer'}
      >
        <BaseBox
          as="div"
          width={makeSize(dimension)}
          height={makeSize(dimension)}
          borderRadius="xsmall"
          flexShrink={0}
          style={{
            backgroundColor: padHexForPicker(color),
            border: `1px solid ${borderColor}`,
            opacity: isDisabled ? 0.5 : 1,
          }}
        />
        <input
          ref={colorInputRef}
          type="color"
          value={padHexForPicker(color).toLowerCase()}
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
