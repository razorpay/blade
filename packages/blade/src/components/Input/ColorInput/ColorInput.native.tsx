import React, { useCallback, useEffect, useState } from 'react';
import type { ColorInputProps, ColorInputValue } from './types';
import { ColorSwatch } from './ColorSwatch.native';
import {
  DEFAULT_COLOR_VALUE,
  isValidHex,
  isPartialHex,
  isValidOpacity,
} from './ColorInput.utils';
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
    defaultValue: defaultValue ?? DEFAULT_COLOR_VALUE,
    onChange: (newValue) => {
      onChange?.({ name, value: newValue });
    },
  });

  const [opacityDisplayValue, setOpacityDisplayValue] = useState<string>(
    String(colorValue.opacity),
  );

  // Local display state for the hex input so partial typing (1–5 chars) stays local
  // and doesn't corrupt the color model until exactly 6 valid chars are present.
  const [hexDisplayValue, setHexDisplayValue] = useState<string>(
    () => value?.hex ?? defaultValue?.hex ?? DEFAULT_COLOR_VALUE.hex,
  );

  useEffect(() => {
    setHexDisplayValue(colorValue.hex);
  }, [colorValue.hex]);

  const { inputId, helpTextId, errorTextId, successTextId } = useFormId('color-input');
  const idBase = useId('color-input');
  const labelId = `${idBase}-label`;

  const handleHexChange = useCallback(
    ({ value: inputValue }: { name?: string; value?: string }) => {
      const raw = (inputValue ?? '').toUpperCase();
      if (isValidHex(raw) || isPartialHex(raw)) {
        setHexDisplayValue(raw);
      }
      if (isValidHex(raw)) {
        setColorValue((prev) => ({ ...prev, hex: raw }));
      }
    },
    [setColorValue],
  );

  const handleOpacityChange = useCallback(
    ({ value: inputValue }: { name?: string; value?: string }) => {
      const raw = inputValue ?? '';
      setOpacityDisplayValue(raw);

      if (raw === '') {
        return;
      }

      const num = parseInt(raw, 10);
      if (!Number.isNaN(num) && isValidOpacity(num)) {
        setColorValue((prev) => ({ ...prev, opacity: num }));
      }
    },
    [setColorValue],
  );

  const handleOpacityBlur = useCallback(
    ({ value: inputValue }: { name?: string; value?: string }) => {
      const raw = inputValue ?? '';
      const num = parseInt(raw, 10);
      if (raw === '' || Number.isNaN(num) || !isValidOpacity(num)) {
        setOpacityDisplayValue(String(colorValue.opacity));
      }
      onBlur?.({ name, value: inputValue });
    },
    [colorValue.opacity, name, onBlur],
  );

  const handleSwatchChange = useCallback(
    (hex: string) => {
      setHexDisplayValue(hex);
      setColorValue((prev) => ({ ...prev, hex }));
    },
    [setColorValue],
  );

  // Hex blur resets partial display to the last committed valid value.
  const handleHexInputBlur = useCallback(
    ({ value: inputValue }: { name?: string; value?: string }) => {
      setHexDisplayValue(colorValue.hex);
      onBlur?.({ name, value: inputValue });
    },
    [colorValue.hex, name, onBlur],
  );

  // Sync opacityDisplayValue when controlled value changes externally
  React.useEffect(() => {
    setOpacityDisplayValue(String(colorValue.opacity));
  }, [colorValue.opacity]);

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
      <BaseBox display="flex" flexDirection="column">
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
              value={hexDisplayValue}
              onChange={handleHexChange}
              onFocus={onFocus}
              onBlur={handleHexInputBlur}
              isDisabled={isDisabled}
              isRequired={isRequired}
              validationState={validationState}
              // eslint-disable-next-line jsx-a11y/no-autofocus
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
                value={opacityDisplayValue}
                onChange={handleOpacityChange}
                onFocus={onFocus}
                onBlur={handleOpacityBlur}
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
