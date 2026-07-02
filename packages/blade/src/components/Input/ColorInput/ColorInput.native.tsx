import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { ColorInputProps, ColorInputValue } from './types';
import { ColorSwatch } from './ColorSwatch.native';
import { DEFAULT_COLOR_VALUE, isValidHex, isPartialHex, isValidOpacity } from './ColorInput.utils';
import { BaseInput, getHintType } from '~components/Input/BaseInput/BaseInput';
import { FormLabel } from '~components/Form/FormLabel';
import { FormHint } from '~components/Form/FormHint';
import { useFormId } from '~components/Form/useFormId';
import { useControllableState } from '~utils/useControllable';
import { useId } from '~utils/useId';
import BaseBox from '~components/Box/BaseBox';
import { getStyledProps } from '~components/Box/styledProps';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
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
    ...rest
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

  // Focus boundary tracking (mirrors web): fire onFocus/onBlur once on composite enter/leave.
  const isFocusedRef = useRef(false);
  const blurTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Skip while focused so a controlled parent updating value mid-edit doesn't clobber partial input.
  useEffect(() => {
    if (!isFocusedRef.current) {
      setHexDisplayValue(colorValue.hex);
    }
  }, [colorValue.hex]);

  useEffect(() => {
    return () => {
      if (blurTimeoutRef.current !== null) clearTimeout(blurTimeoutRef.current);
    };
  }, []);

  const handleInputFocus = useCallback(
    (args: { name?: string; value?: string }) => {
      if (blurTimeoutRef.current !== null) {
        clearTimeout(blurTimeoutRef.current);
        blurTimeoutRef.current = null;
      }
      if (!isFocusedRef.current) {
        isFocusedRef.current = true;
        onFocus?.(args);
      }
    },
    [onFocus],
  );

  const handleInputBlurBoundary = useCallback(
    (args: { name?: string; value?: string }) => {
      blurTimeoutRef.current = setTimeout(() => {
        blurTimeoutRef.current = null;
        isFocusedRef.current = false;
        onBlur?.(args);
      }, 0);
    },
    [onBlur],
  );

  const { inputId, helpTextId, errorTextId, successTextId } = useFormId('color-input');
  const idBase = useId('color-input');
  const labelId = `${idBase}-label`;

  const handleHexChange = useCallback(
    ({ value: inputValue }: { name?: string; value?: string }) => {
      // Strip a leading '#' so pasting '#FF5733' or typing '#' works naturally.
      const raw = (inputValue ?? '').replace(/^#/, '').toUpperCase();
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

      // Reject strings with non-digit characters (e.g. '5a', '100x').
      if (!/^\d+$/.test(raw)) {
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
      if (raw === '' || !/^\d+$/.test(raw) || Number.isNaN(num) || !isValidOpacity(num)) {
        setOpacityDisplayValue(String(colorValue.opacity));
      }
      // Pass committed opacity so consumers see the corrected state, not the partial display string.
      handleInputBlurBoundary({ name, value: String(colorValue.opacity) });
    },
    [colorValue.opacity, handleInputBlurBoundary, name],
  );

  const handleSwatchChange = useCallback(
    (hex: string) => {
      setHexDisplayValue(hex);
      setColorValue((prev) => ({ ...prev, hex }));
    },
    [setColorValue],
  );

  // Hex blur resets partial display to the last committed valid value.
  const handleHexInputBlur = useCallback(() => {
    setHexDisplayValue(colorValue.hex);
    // Pass committed hex so consumers see the corrected state, not the partial display string.
    handleInputBlurBoundary({ name, value: colorValue.hex });
  }, [colorValue.hex, handleInputBlurBoundary, name]);

  // Sync opacityDisplayValue when controlled value changes externally.
  // Skip while focused so a controlled parent updating value mid-edit doesn't clobber partial input.
  React.useEffect(() => {
    if (!isFocusedRef.current) {
      setOpacityDisplayValue(String(colorValue.opacity));
    }
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
      {...getStyledProps(rest)}
      {...makeAnalyticsAttribute(rest)}
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
              onFocus={handleInputFocus}
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
                onFocus={handleInputFocus}
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
