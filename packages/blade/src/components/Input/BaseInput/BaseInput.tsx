import React from 'react';
import type { ReactElement, ReactNode } from 'react';
import { StyledBaseInput } from './StyledBaseInput';
import { BaseInputVisuals } from './BaseInputVisuals';
import Box from '~components/Box';
import { FormHint, FormLabel } from '~components/Form';
import { getPlatformType, useBreakpoint } from '~utils';
import type { FormLabelProps } from '~components/Form/FormLabel';
import type { FormHintProps } from '~components/Form/FormHint';
import { useFormId } from '~components/Form/useFormId';
import { useTheme } from '~components/BladeProvider';
import type { IconComponent } from '~components/Icons';

/**
 * Remaining things for Slots
 * 1. compute padding left and right
 * 2. compute padding left and right with prefix and suffix as dynamic things
 * 3. make interaction element work
 * 4. remove hardcoding from the input styles for native - done
 */

export type HandleOnChange = ({
  name,
  value,
}: {
  name?: string;
  value?: React.ChangeEvent<HTMLInputElement> | string;
}) => void;

export type OnChange = ({ name, value }: { name?: string; value?: string }) => void;

// TODO: need to abstract for generic use
type InputLabelProps = {
  /**
   * Label to be shown for the input field
   */
  label: string;
  /**
   * Desktop only prop. on Mobile by default the label will be on top
   */
  labelPosition?: FormLabelProps['position'];
  /**
   * Displays `(optional)` when `optional` is passed or `*` when `required` is passed
   */
  neccessityIndicator?: FormLabelProps['neccessityIndicator'];
};

// TODO: need to abstract for generic use
type InputValidationProps = {
  /**
   * Help text for the input
   */
  helpText?: string;
  /**
   * Error text for the input
   *
   * Renders when `validationState` is set to 'error'
   */
  errorText?: string;
  /**
   * success text for the input
   *
   * Renders when `validationState` is set to 'success'
   */
  successText?: string;
  /**
   * If `error`, the input is marked as invalid,
   * and `invalid` attribute will be added
   *
   * If `success`, the input is marked as valid,
   *
   */
  validationState?: 'success' | 'error' | 'none';
};

export type BaseInputProps = InputLabelProps &
  InputValidationProps & {
    /**
     * ID that will be used for accessibility
     */
    id: string;
    /**
     * Placeholder text to be displayed inside the input field
     */
    placeholder?: string;
    /**
     * Type of Input Field to be rendered.
     *
     * @default text
     */
    type?: 'text' | 'telephone' | 'email' | 'url' | 'numeric' | 'search';
    /**
     * Used to set the default value of input field when it's uncontrolled
     */
    defaultValue?: string;
    /**
     * The name of the input field.
     *
     * Useful in form submissions
     */
    name?: string;
    /**
     * The callback function to be invoked when the value of the input field changes
     */
    onChange?: OnChange;
    /**
     * Used to turn the input field to controlled so user can control the value
     */
    value?: string;
    /**
     * Used to disable the input field
     */
    isDisabled?: boolean;
    /**
     * If true, the input is marked as required, and `required` attribute will be added
     */
    isRequired?: boolean;
    /**
     * Icon to be shown at the start of the input field
     */
    leadingIcon?: IconComponent;
    /**
     * Prefix symbol to be displayed at the beginning of the input field
     */
    prefix?: string;
    interactionElement?: ReactNode;
    // /**
    //  * Decides whether to render a clear icon button
    //  */
    // showClearButton?: boolean;
    // /**
    //  * Event handler to handle the onClick event for clear button.
    //  */
    // onClearButtonClick?: () => void;
    /**
     * Decides whether to show a loading spinner for the input field.
     */
    isLoading?: boolean;
    /**
     * Suffix symbol to be displayed at the beginning of the input field
     */
    suffix?: string;
    /**
     * Icon to be displayed at the end of the input field
     */
    trailingIcon?: IconComponent;
    /**
     * Displays the character counter under the input field
     */
    maxCharacters?: number;
  };

const useInput = ({
  value,
  defaultValue,
  onChange,
}: Pick<BaseInputProps, 'value' | 'defaultValue' | 'onChange'>): {
  handleOnChange: HandleOnChange;
} => {
  if (value && defaultValue) {
    throw new Error(
      `[Blade Input]: Either 'value' or 'defaultValue' shall be passed. This decides if the input field is controlled or uncontrolled`,
    );
  }

  const handleOnChange: HandleOnChange = React.useCallback(
    ({ name, value }) => {
      let _value = '';

      if (getPlatformType() === 'react-native' && typeof value === 'string') {
        _value = value;
      } else if (typeof value !== 'string') {
        // it's weird but TS forced me to write this much code where I could have just done "getPlatformType() === 'react-native' ? value : value?.target.value" :(
        _value = value?.target.value ?? '';
      }

      onChange?.({
        name,
        value: _value,
      });
    },
    [onChange],
  );

  return { handleOnChange };
};

export const getHintType = ({
  validationState,
  hasHelpText,
}: {
  validationState: BaseInputProps['validationState'];
  hasHelpText: boolean;
}): FormHintProps['type'] => {
  if (validationState === 'error') {
    return 'error';
  }

  if (validationState === 'success') {
    return 'success';
  }

  if (hasHelpText) {
    return 'help';
  }

  return 'help';
};

export const BaseInput = ({
  label,
  labelPosition = 'top',
  placeholder,
  type = 'text',
  defaultValue,
  name,
  value,
  onChange,
  isDisabled,
  neccessityIndicator,
  validationState,
  errorText,
  helpText,
  successText,
  isRequired,
  leadingIcon,
  prefix,
  interactionElement,
  suffix,
  trailingIcon,
}: BaseInputProps): ReactElement => {
  const { theme } = useTheme();
  const { handleOnChange } = useInput({ defaultValue, value, onChange });
  const { labelId, inputId, helpTextId, errorTextId, successTextId } = useFormId('input-field');
  const { matchedDeviceType } = useBreakpoint({ breakpoints: theme.breakpoints });
  const isLabelLeftPositioned = labelPosition === 'left' && matchedDeviceType === 'desktop';

  return (
    <>
      <Box
        display="flex"
        flexDirection={isLabelLeftPositioned ? 'row' : 'column'}
        justifyContent={isLabelLeftPositioned ? 'center' : undefined}
        alignItems={isLabelLeftPositioned ? 'center' : undefined}
      >
        <FormLabel
          as="label"
          neccessityIndicator={neccessityIndicator}
          id={labelId}
          position={labelPosition}
          htmlFor={inputId}
        >
          {label}
        </FormLabel>
        <Box position="relative" width="100%">
          <BaseInputVisuals leadingIcon={leadingIcon} prefix={prefix} />
          <StyledBaseInput
            id={inputId}
            name={name}
            type={type}
            defaultValue={defaultValue}
            value={value}
            placeholder={placeholder}
            isDisabled={isDisabled}
            validationState={validationState}
            isRequired={isRequired}
            handleOnChange={handleOnChange}
            hasLeadingIcon={true}
          />
          <BaseInputVisuals
            interactionElement={interactionElement}
            suffix={suffix}
            trailingIcon={trailingIcon}
          />
        </Box>
      </Box>
      <Box marginLeft={isLabelLeftPositioned ? 120 : undefined}>
        <FormHint
          type={getHintType({ validationState, hasHelpText: Boolean(helpText) })}
          helpText={helpText}
          errorText={errorText}
          successText={successText}
          helpTextId={helpTextId}
          errorTextId={errorTextId}
          successTextId={successTextId}
        />
      </Box>
    </>
  );
};
