import React, { useCallback } from 'react';
import type { ColorInputProps, ColorInputValue } from './types';
import { ColorSwatch } from './ColorSwatch.native';
import { BaseInput, getHintType } from '~components/Input/BaseInput/BaseInput';
import { FormLabel } from '~components/Form/FormLabel';
import { FormHint } from '~components/Form/FormHint';
import { useFormId } from '~components/Form/useFormId';
import { useControllableState } from '~utils/useControllable';
import { useId } from '~utils/useId';
import BaseBox from '~components/Box/BaseBox';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import type { BladeElementRef } from '~utils/types';

const DEFAULT_VALUE: ColorInputValue = { hex: 'FFFFFF', opacity: 100 };

const HEX_REGEX = /^[0-9A-Fa-f]*$/;

const isValidHex = (value: string): boolean => HEX_REGEX.test(value) && value.length <= 6;

const isValidOpacity = (value: number): boolean =>
  Number.isInteger(value) && value >= 0 && value <= 100;

const _ColorInput: React.ForwardRefRenderFunction<BladeElementRef, ColorInputProps> = (
  {
    label,
    accessibilityLabel,
    labelPosition = 'top',
    size = 'medium',
    name,
    value,
    defaultValue,
    onChange,
    onFocus,
    onBlur,
    showOpacity = true,
    validationState = 'none',
    helpText,
    errorText,
    successText,
    necessityIndicator,
    isRequired,
    isDisabled = false,
    autoFocus,
    testID,
  },
  _ref,
) => {
  const [colorValue, setColorValue] = useControllableState<ColorInputValue>({
    value,
    defaultValue: defaultValue ?? DEFAULT_VALUE,
    onChange: (newValue) => {
      onChange?.({ ...newValue, name });
    },
  });

  const { inputId, helpTextId, errorTextId, successTextId } = useFormId('color-input');
  const idBase = useId('color-input');
  const labelId = `${idBase}-label`;

  const handleHexChange = useCallback(
    ({ value: inputValue }: { name?: string; value?: string }) => {
      const raw = (inputValue ?? '').toUpperCase();
      if (isValidHex(raw)) {
        setColorValue(() => ({ ...colorValue, hex: raw }));
      }
    },
    [colorValue, setColorValue],
  );

  const handleOpacityChange = useCallback(
    ({ value: inputValue }: { name?: string; value?: string }) => {
      const num = parseInt(inputValue ?? '0', 10);
      if (!Number.isNaN(num) && isValidOpacity(num)) {
        setColorValue(() => ({ ...colorValue, opacity: num }));
      } else if (inputValue === '') {
        setColorValue(() => ({ ...colorValue, opacity: 0 }));
      }
    },
    [colorValue, setColorValue],
  );

  const handleSwatchChange = useCallback(
    (hex: string) => {
      setColorValue(() => ({ ...colorValue, hex }));
    },
    [colorValue, setColorValue],
  );

  const willRenderHintText =
    Boolean(helpText) ||
    (validationState === 'success' && Boolean(successText)) ||
    (validationState === 'error' && Boolean(errorText));

  return (
    <BaseBox
      display="flex"
      flexDirection="column"
      width="100%"
      {...metaAttribute({ name: MetaConstants.ColorInput, testID })}
    >
      <BaseBox
        display="flex"
        flexDirection="column"
      >
        {label && (
          <FormLabel
            as="span"
            position={labelPosition}
            id={labelId}
            size={size}
            necessityIndicator={necessityIndicator}
          >
            {label}
          </FormLabel>
        )}

        <BaseBox display="flex" flexDirection="row">
          <BaseBox flex="1">
            <BaseInput
              id={inputId}
              label={label}
              hideLabelText
              accessibilityLabel={accessibilityLabel ?? label ?? 'Color hex code'}
              labelId={labelId}
              size={size}
              placeholder="000000"
              value={colorValue.hex}
              onChange={handleHexChange}
              onFocus={onFocus}
              onBlur={onBlur}
              isDisabled={isDisabled}
              isRequired={isRequired}
              validationState={validationState}
              autoFocus={autoFocus}
              maxCharacters={6}
              hideFormHint
              textAlign="left"
              leadingInteractionElement={
                <ColorSwatch
                  color={colorValue.hex}
                  size={size}
                  isDisabled={isDisabled}
                  onChange={handleSwatchChange}
                />
              }
            />
          </BaseBox>

          {showOpacity && (
            <BaseBox width="80px" flexShrink={0}>
              <BaseInput
                id={`${inputId}-opacity`}
                label="Opacity"
                hideLabelText
                accessibilityLabel="Color opacity percentage"
                size={size}
                placeholder="100"
                value={String(colorValue.opacity)}
                onChange={handleOpacityChange}
                onFocus={onFocus}
                onBlur={onBlur}
                isDisabled={isDisabled}
                validationState={validationState}
                suffix="%"
                textAlign="right"
                hideFormHint
              />
            </BaseBox>
          )}
        </BaseBox>
      </BaseBox>

      {willRenderHintText && (
        <FormHint
          type={getHintType({ validationState, hasHelpText: Boolean(helpText) })}
          helpText={helpText}
          errorText={errorText}
          successText={successText}
          helpTextId={helpTextId}
          errorTextId={errorTextId}
          successTextId={successTextId}
          size={size}
        />
      )}
    </BaseBox>
  );
};

const ColorInput = assignWithoutSideEffects(React.forwardRef(_ColorInput), {
  displayName: 'ColorInput',
  componentId: 'ColorInput',
});

export { ColorInput };
