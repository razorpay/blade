import React, { useCallback, useRef, useState } from 'react';
import type { ColorInputProps, ColorInputValue } from './types';
import { ColorSwatch } from './ColorSwatch.web';
import type { ColorSwatchRef } from './ColorSwatch.web';
import { StyledColorInput, COLOR_INPUT_ROW_CLASSNAME } from './StyledColorInput';
import { DEFAULT_COLOR_VALUE, isValidHex, isValidOpacity } from './ColorInput.utils';
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
  });

  const [opacityDisplayValue, setOpacityDisplayValue] = useState<string>(
    String(colorValue.opacity),
  );

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
      const raw = (inputValue ?? '').toUpperCase();
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

  const handleOpacityKeyDown = useCallback(
    ({ key, event }: { name?: string; key?: string; code?: string; event: unknown }) => {
      if (key === 'ArrowUp') {
        (event as Event & { preventDefault: () => void }).preventDefault();
        setColorValue((prev) => {
          const next = Math.min(prev.opacity + 1, 100);
          if (next !== prev.opacity) {
            setOpacityDisplayValue(String(next));
            return { ...prev, opacity: next };
          }
          return prev;
        });
      } else if (key === 'ArrowDown') {
        (event as Event & { preventDefault: () => void }).preventDefault();
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
      setColorValue((prev) => ({ ...prev, hex }));
    },
    [setColorValue],
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
              value={colorValue.hex}
              onChange={handleHexChange}
              onFocus={onFocus}
              onBlur={onBlur}
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
