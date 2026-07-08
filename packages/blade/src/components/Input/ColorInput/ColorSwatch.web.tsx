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
  onFocus?: () => void;
  onBlur?: () => void;
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
  ({ color, size: inputSize, isDisabled, onChange, onFocus, onBlur }, ref) => {
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
      // Keep '#' prefix so the value matches ColorInputValue.hex format (e.g. '#FF5733').
      const hexValue = e.target.value.toUpperCase();
      onChange(hexValue);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>): void => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        colorInputRef.current?.click();
      }
    };

    const dimension = swatchSizeTokens[inputSize];

    return (
      <BaseBox
        display="flex"
        alignItems="center"
        justifyContent="center"
        position="relative"
        role="button"
        aria-label="Open color picker"
        tabIndex={isDisabled ? -1 : 0}
        onKeyDown={handleKeyDown}
        onFocus={onFocus}
        onBlur={onBlur}
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
        {/* Positioned over the swatch so clicks go directly to the input — avoids
            programmatic .click() which does not open the picker on Firefox/Safari iOS. */}
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
            inset: 0,
            width: '100%',
            height: '100%',
            opacity: 0,
            cursor: isDisabled ? 'not-allowed' : 'pointer',
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
