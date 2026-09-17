import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import BaseBox from '~components/Box/BaseBox';
import type { BaseInputProps } from '~components/Input/BaseInput';
import { useTheme } from '~components/BladeProvider';
import { makeSize } from '~utils/makeSize';
import { opacity, size } from '~tokens/global';
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
  xsmall: 'spacing.2',
  small: 'spacing.2',
  medium: 'spacing.2',
  large: 'spacing.3',
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
        paddingLeft={swatchLeftPaddingTokens[inputSize]}
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
            opacity: isDisabled ? opacity['500'] : 1,
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
