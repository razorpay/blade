import React, { useRef } from 'react';
import type { BaseInputProps } from '../BaseInput';
import { BaseInput } from '../BaseInput';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { MetaConstants } from '~utils/metaAttribute';
import type { DataAnalyticsAttribute, BladeElementRef } from '~utils/types';
import BaseBox from '~components/Box/BaseBox';
import { makeSize } from '~utils/makeSize';

// Hex color regex: #RRGGBB or #RGB
const HEX_COLOR_REGEX = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;

const isValidHexColor = (value: string): boolean => HEX_COLOR_REGEX.test(value);

const normalizeToFullHex = (value: string): string => {
  if (/^#[0-9A-Fa-f]{3}$/.test(value)) {
    const r = value[1];
    const g = value[2];
    const b = value[3];
    return `#${r}${r}${g}${g}${b}${b}`;
  }
  return value;
};

type ColorInputCommonProps = Pick<
  BaseInputProps,
  | 'label'
  | 'accessibilityLabel'
  | 'labelPosition'
  | 'labelSuffix'
  | 'labelTrailing'
  | 'validationState'
  | 'helpText'
  | 'errorText'
  | 'successText'
  | 'isDisabled'
  | 'isRequired'
  | 'necessityIndicator'
  | 'defaultValue'
  | 'name'
  | 'onChange'
  | 'onFocus'
  | 'onBlur'
  | 'value'
  | 'autoFocus'
  | 'testID'
  | 'size'
  | keyof DataAnalyticsAttribute
> & {
  /**
   * Placeholder text displayed in the input field.
   * @default '#000000'
   */
  placeholder?: string;
} & StyledPropsBlade;

/*
  Mandatory accessibilityLabel prop when label is not provided
*/
type ColorInputPropsWithA11yLabel = {
  label?: undefined;
  accessibilityLabel: string;
};

/*
  Optional accessibilityLabel prop when label is provided
*/
type ColorInputPropsWithLabel = {
  label: string;
  accessibilityLabel?: string;
};

type ColorInputProps = (ColorInputPropsWithA11yLabel | ColorInputPropsWithLabel) &
  ColorInputCommonProps;

const ColorSwatch = ({
  color,
  isDisabled,
  size,
  onClick,
  pickerRef,
}: {
  color: string;
  isDisabled?: boolean;
  size?: BaseInputProps['size'];
  onClick: () => void;
  pickerRef: React.RefObject<HTMLInputElement>;
}): React.ReactElement => {
  const swatchSize = size === 'large' ? 20 : 16;

  return (
    <BaseBox position="relative" display="flex" alignItems="center">
      {/* Hidden native color picker */}
      <input
        ref={pickerRef}
        type="color"
        aria-hidden="true"
        tabIndex={-1}
        style={{
          position: 'absolute',
          opacity: 0,
          width: 0,
          height: 0,
          border: 'none',
          padding: 0,
          pointerEvents: 'none',
        }}
      />
      {/* Visible color swatch */}
      <BaseBox
        as="button"
        type="button"
        onClick={isDisabled ? undefined : onClick}
        aria-label="Open color picker"
        style={{
          width: makeSize(swatchSize),
          height: makeSize(swatchSize),
          borderRadius: '3px',
          backgroundColor: isValidHexColor(color) ? color : '#000000',
          border: '1px solid rgba(0,0,0,0.15)',
          cursor: isDisabled ? 'not-allowed' : 'pointer',
          padding: 0,
          flexShrink: 0,
        }}
      />
    </BaseBox>
  );
};

const _ColorInput: React.ForwardRefRenderFunction<BladeElementRef, ColorInputProps> = (
  {
    label,
    accessibilityLabel,
    labelPosition = 'top',
    validationState,
    errorText,
    successText,
    helpText,
    isDisabled = false,
    defaultValue,
    placeholder = '#000000',
    isRequired = false,
    necessityIndicator,
    value,
    onChange,
    onFocus,
    onBlur,
    name,
    autoFocus = false,
    testID,
    size = 'medium',
    labelSuffix,
    labelTrailing,
    ...rest
  },
  ref,
): React.ReactElement => {
  const pickerRef = useRef<HTMLInputElement>(null);

  // Track internal value for uncontrolled usage
  const [internalValue, setInternalValue] = React.useState<string>(defaultValue ?? '');
  const currentValue = value !== undefined ? value : internalValue;

  const handlePickerChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const pickerColor = e.target.value; // Always #RRGGBB from native picker
    if (value === undefined) {
      setInternalValue(pickerColor);
    }
    onChange?.({ name, value: pickerColor });
  };

  const handleTextChange: BaseInputProps['onChange'] = ({ name: inputName, value: inputValue }) => {
    const val = inputValue ?? '';
    if (value === undefined) {
      setInternalValue(val);
    }
    onChange?.({ name: inputName, value: val });

    // Sync native picker if valid hex
    if (pickerRef.current && isValidHexColor(val)) {
      pickerRef.current.value = normalizeToFullHex(val);
    }
  };

  const openColorPicker = (): void => {
    if (pickerRef.current) {
      // Sync current value to picker before opening
      if (isValidHexColor(currentValue)) {
        pickerRef.current.value = normalizeToFullHex(currentValue);
      }
      pickerRef.current.style.pointerEvents = 'auto';
      pickerRef.current.click();
      // Restore pointer-events after click
      setTimeout(() => {
        if (pickerRef.current) {
          pickerRef.current.style.pointerEvents = 'none';
        }
      }, 0);
    }
  };

  // Listen to picker changes
  React.useEffect(() => {
    const picker = pickerRef.current;
    if (!picker) return;

    const onInput = (e: Event): void => {
      handlePickerChange(e as unknown as React.ChangeEvent<HTMLInputElement>);
    };
    picker.addEventListener('input', onInput);
    return () => picker.removeEventListener('input', onInput);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, name]);

  const colorSwatchElement = (
    <ColorSwatch
      color={currentValue}
      isDisabled={isDisabled}
      size={size}
      onClick={openColorPicker}
      pickerRef={pickerRef}
    />
  );

  return (
    <BaseInput
      ref={ref}
      componentName={MetaConstants.ColorInput}
      id="color-input"
      label={label as string}
      accessibilityLabel={accessibilityLabel}
      hideLabelText={!Boolean(label)}
      labelPosition={labelPosition}
      labelSuffix={labelSuffix}
      labelTrailing={labelTrailing}
      type="text"
      placeholder={placeholder}
      defaultValue={value !== undefined ? undefined : defaultValue}
      value={value !== undefined ? value : undefined}
      name={name}
      validationState={validationState}
      errorText={errorText}
      successText={successText}
      helpText={helpText}
      isDisabled={isDisabled}
      isRequired={isRequired}
      necessityIndicator={necessityIndicator}
      onChange={handleTextChange}
      onFocus={onFocus}
      onBlur={onBlur}
      // eslint-disable-next-line jsx-a11y/no-autofocus
      autoFocus={autoFocus}
      testID={testID}
      size={size}
      leadingInteractionElement={colorSwatchElement}
      {...rest}
    />
  );
};

const ColorInput = assignWithoutSideEffects(React.forwardRef(_ColorInput), {
  displayName: 'ColorInput',
});

export type { ColorInputProps };
export { ColorInput };
