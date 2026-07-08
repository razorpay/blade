import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { ColorInputProps, ColorInputValue } from './types';
import { ColorSwatch } from './ColorSwatch.web';
import type { ColorSwatchRef } from './ColorSwatch.web';
import { StyledColorInput, COLOR_INPUT_ROW_CLASSNAME } from './StyledColorInput';
import { DEFAULT_COLOR_VALUE, isValidHex, isPartialHex, isValidOpacity } from './ColorInput.utils';
import { formHintLeftLabelMarginLeft } from '~components/Input/BaseInput/baseInputTokens';
import { BaseInput, getHintType } from '~components/Input/BaseInput/BaseInput';
import { FormLabel } from '~components/Form/FormLabel';
import { FormHint } from '~components/Form/FormHint';
import { useFormId } from '~components/Form/useFormId';
import { useControllableState } from '~utils/useControllable';
import { useId } from '~utils/useId';
import { useTheme } from '~components/BladeProvider';
import { useBreakpoint } from '~utils';
import BaseBox from '~components/Box/BaseBox';
import { getStyledProps } from '~components/Box/styledProps';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { makeSize } from '~utils/makeSize';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import type { BladeElementRef } from '~utils/types';
import type { FormInputOnEvent } from '~components/Form';
import type { FormInputOnKeyDownEvent } from '~components/Form/FormTypes';

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
  ref,
) => {
  const [colorValue, setColorValue] = useControllableState<ColorInputValue>({
    value,
    defaultValue: defaultValue ?? DEFAULT_COLOR_VALUE,
    onChange: (newValue) => {
      onChange?.({ name, value: newValue });
    },
    shouldUpdate: (prev, next) => prev.hex !== next.hex || prev.opacity !== next.opacity,
  });

  const [opacityDisplayValue, setOpacityDisplayValue] = useState<string>(() =>
    String(value?.opacity ?? defaultValue?.opacity ?? DEFAULT_COLOR_VALUE.opacity),
  );

  // Local display state for the hex input so partial typing (1–5 chars) stays local
  // and doesn't corrupt the color model until exactly 6 valid chars are present.
  const [hexDisplayValue, setHexDisplayValue] = useState<string>(() =>
    (value?.hex ?? defaultValue?.hex ?? DEFAULT_COLOR_VALUE.hex).replace(/^#/, ''),
  );

  // Focus boundary tracking: fire onFocus/onBlur once when focus enters/leaves
  // the composite widget, not on each internal input transition.
  const isFocusedRef = useRef(false);
  const blurTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Store onBlur in a ref so handleInputBlur is referentially stable and does not
  // need to be a dependency of downstream blur handlers (avoiding stale closures).
  const onBlurRef = useRef(onBlur);
  useEffect(() => {
    onBlurRef.current = onBlur;
  }, [onBlur]);

  // Sync display value when the color model changes from an external source.
  // Skip while focused so a controlled parent updating value mid-edit doesn't clobber partial input.
  useEffect(() => {
    if (!isFocusedRef.current) {
      setHexDisplayValue(colorValue.hex.replace(/^#/, ''));
    }
  }, [colorValue.hex]);

  useEffect(() => {
    return () => {
      if (blurTimeoutRef.current !== null) clearTimeout(blurTimeoutRef.current);
    };
  }, []);

  const handleInputFocus = useCallback<FormInputOnEvent>(
    (args) => {
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

  // Stable blur handler — uses onBlurRef so it never becomes a stale dep in callers.
  const handleInputBlur = useCallback<FormInputOnEvent>((args) => {
    blurTimeoutRef.current = setTimeout(() => {
      blurTimeoutRef.current = null;
      isFocusedRef.current = false;
      onBlurRef.current?.(args);
    }, 0);
  }, []);

  const hexInputRef = useRef<BladeElementRef>(null);
  const swatchRef = useRef<ColorSwatchRef>(null);
  const { inputId, helpTextId, errorTextId, successTextId } = useFormId('color-input');
  const idBase = useId('color-input');
  const labelId = `${idBase}-label`;
  const { theme } = useTheme();
  const { matchedDeviceType } = useBreakpoint({ breakpoints: theme.breakpoints });
  const isLabelLeftPositioned = labelPosition === 'left' && matchedDeviceType === 'desktop';

  const handleHexChange = useCallback(
    ({ value: inputValue }: { name?: string; value?: string }) => {
      // Strip a leading '#' and trim whitespace so pasting '#FF5733 ' or typing '#' works naturally.
      const raw = (inputValue ?? '').replace(/^#/, '').trim().toUpperCase();
      if (raw === '') {
        setHexDisplayValue('');
        return;
      }
      if (isValidHex(raw) || isPartialHex(raw)) {
        setHexDisplayValue(raw);
      }
      if (isValidHex(raw)) {
        setColorValue((prev) => ({ ...prev, hex: `#${raw}` }));
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

      // Reject strings with non-digit characters (e.g. '5a', '100x') so parseInt
      // can't silently truncate and commit a partial value.
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

  const handleOpacityBlur = useCallback<FormInputOnEvent>(
    (args) => {
      const raw = args.value ?? '';
      const num = parseInt(raw, 10);
      if (raw === '' || !/^\d+$/.test(raw) || Number.isNaN(num) || !isValidOpacity(num)) {
        setOpacityDisplayValue(String(colorValue.opacity));
      }
      handleInputBlur({ name, value: String(colorValue.opacity) });
    },
    [colorValue.opacity, handleInputBlur, name],
  );

  const handleOpacityKeyDown = useCallback(
    ({ key, event }: FormInputOnKeyDownEvent) => {
      if (key === 'ArrowUp') {
        event.preventDefault();
        setColorValue((prev) => {
          const next = Math.min(prev.opacity + 1, 100);
          if (next !== prev.opacity) {
            setOpacityDisplayValue(String(next));
            return { ...prev, opacity: next };
          }
          return prev;
        });
      } else if (key === 'ArrowDown') {
        event.preventDefault();
        setColorValue((prev) => {
          const next = Math.max(prev.opacity - 1, 0);
          if (next !== prev.opacity) {
            setOpacityDisplayValue(String(next));
            return { ...prev, opacity: next };
          }
          return prev;
        });
      }
    },
    [setColorValue],
  );

  const handleSwatchChange = useCallback(
    (hex: string) => {
      // hex arrives with '#' prefix from ColorSwatch; strip for display, keep for model.
      setHexDisplayValue(hex.replace(/^#/, ''));
      setColorValue((prev) => ({ ...prev, hex }));
    },
    [setColorValue],
  );

  // Hex-specific blur: reset partial display to last committed valid value.
  const handleHexInputBlur = useCallback<FormInputOnEvent>(() => {
    setHexDisplayValue(colorValue.hex.replace(/^#/, ''));
    // Pass committed hex so consumers see the corrected state, not the partial display string.
    handleInputBlur({ name, value: colorValue.hex });
  }, [colorValue.hex, handleInputBlur, name]);

  // Sync opacityDisplayValue when controlled value changes externally.
  // Skip while focused so a controlled parent updating value mid-edit doesn't clobber partial input.
  useEffect(() => {
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
      ref={ref as React.Ref<HTMLDivElement>}
      display="flex"
      flexDirection="column"
      width="100%"
      {...metaAttribute({ name: MetaConstants.ColorInput, testID })}
      {...getStyledProps(rest)}
      {...makeAnalyticsAttribute(rest)}
    >
      <BaseBox
        display="flex"
        flexDirection={isLabelLeftPositioned ? 'row' : 'column'}
        alignItems={isLabelLeftPositioned ? 'center' : undefined}
      >
        {label && (
          <FormLabel
            as="label"
            position={labelPosition}
            id={labelId}
            htmlFor={inputId}
            size={size}
            necessityIndicator={necessityIndicator}
          >
            {label}
          </FormLabel>
        )}

        <StyledColorInput>
          <BaseBox flex="1" minWidth="0px" className={COLOR_INPUT_ROW_CLASSNAME}>
            <BaseInput
              ref={hexInputRef}
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
                  ref={swatchRef}
                  color={colorValue.hex}
                  size={size}
                  isDisabled={isDisabled}
                  onChange={handleSwatchChange}
                  onFocus={() => handleInputFocus({ name })}
                  onBlur={() => handleInputBlur({ name, value: colorValue.hex })}
                />
              }
            />
          </BaseBox>

          {showOpacity && (
            <BaseBox width="80px" flexShrink={0} className={COLOR_INPUT_ROW_CLASSNAME}>
              <BaseInput
                id={`${inputId}-opacity`}
                label="Opacity"
                hideLabelText
                accessibilityLabel="Color opacity percentage"
                size={size}
                placeholder="100"
                value={opacityDisplayValue}
                onChange={handleOpacityChange}
                onKeyDown={handleOpacityKeyDown}
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
        </StyledColorInput>
      </BaseBox>

      {willRenderHintText && (
        <BaseBox
          marginLeft={makeSize(
            label && isLabelLeftPositioned ? formHintLeftLabelMarginLeft[size] : 0,
          )}
        >
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
        </BaseBox>
      )}
    </BaseBox>
  );
};

const ColorInput = assignWithoutSideEffects(React.forwardRef(_ColorInput), {
  displayName: 'ColorInput',
  componentId: 'ColorInput',
});

export { ColorInput };
