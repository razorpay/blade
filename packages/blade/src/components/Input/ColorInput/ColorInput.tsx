import React from 'react';
import type { BaseInputProps } from '../BaseInput';
import { BaseInput } from '../BaseInput';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { MetaConstants } from '~utils/metaAttribute';
import type { DataAnalyticsAttribute, BladeElementRef } from '~utils/types';
import BaseBox from '~components/Box/BaseBox';
import { makeSize } from '~utils/makeSize';

type ColorInputCommonProps = Pick<
  BaseInputProps,
  | 'label'
  | 'accessibilityLabel'
  | 'labelPosition'
  | 'labelSuffix'
  | 'labelTrailing'
  | 'validationState'
  | 'errorText'
  | 'successText'
  | 'helpText'
  | 'isDisabled'
  | 'defaultValue'
  | 'placeholder'
  | 'isRequired'
  | 'necessityIndicator'
  | 'value'
  | 'onChange'
  | 'onBlur'
  | 'onFocus'
  | 'name'
  | 'autoFocus'
  | 'testID'
  | 'size'
  | keyof DataAnalyticsAttribute
> &
  StyledPropsBlade;

type ColorInputPropsWithA11yLabel = {
  label?: undefined;
  accessibilityLabel: string;
};

type ColorInputPropsWithLabel = {
  label: string;
  accessibilityLabel?: string;
};

type ColorInputProps = (ColorInputPropsWithA11yLabel | ColorInputPropsWithLabel) &
  ColorInputCommonProps;

const isValidHexColor = (value: string): boolean => {
  return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{4}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/.test(value);
};

const ColorSwatch = ({
  color,
  size,
}: {
  color: string;
  size: NonNullable<BaseInputProps['size']>;
}): React.ReactElement => {
  const swatchSize = size === 'large' ? 20 : 16;
  const isValid = isValidHexColor(color);

  return (
    <BaseBox
      width={makeSize(swatchSize)}
      height={makeSize(swatchSize)}
      borderRadius="small"
      borderWidth="thin"
      borderColor="surface.border.gray.muted"
      style={{
        backgroundColor: isValid ? color : 'transparent',
        flexShrink: 0,
      }}
    />
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
    necessityIndicator = 'none',
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
) => {
  const [internalValue, setInternalValue] = React.useState<string>(
    (value ?? defaultValue ?? '') as string,
  );

  const currentValue = value !== undefined ? (value as string) : internalValue;

  const handleChange: BaseInputProps['onChange'] = (event) => {
    if (value === undefined) {
      setInternalValue(event.value as string);
    }
    onChange?.(event);
  };

  React.useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value as string);
    }
  }, [value]);

  const colorSwatch = currentValue ? <ColorSwatch color={currentValue} size={size} /> : null;

  return (
    <BaseInput
      ref={ref}
      componentName={MetaConstants.ColorInput}
      id="color-input"
      label={label as string}
      accessibilityLabel={accessibilityLabel}
      hideLabelText={!Boolean(label)}
      labelPosition={labelPosition}
      type="text"
      labelSuffix={labelSuffix}
      labelTrailing={labelTrailing}
      leadingInteractionElement={colorSwatch}
      validationState={validationState}
      errorText={errorText}
      successText={successText}
      helpText={helpText}
      isDisabled={isDisabled}
      defaultValue={defaultValue}
      placeholder={placeholder}
      isRequired={isRequired}
      necessityIndicator={necessityIndicator}
      value={value}
      onChange={handleChange}
      onBlur={onBlur}
      onFocus={onFocus}
      name={name}
      // eslint-disable-next-line jsx-a11y/no-autofocus
      autoFocus={autoFocus}
      autoCapitalize="none"
      testID={testID}
      size={size}
      {...rest}
    />
  );
};

// nosemgrep
const ColorInput = assignWithoutSideEffects(React.forwardRef(_ColorInput), {
  displayName: 'ColorInput',
});

export type { ColorInputProps };
export { ColorInput };
