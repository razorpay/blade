import React from 'react';
import { radioSizes } from '../radioTokens';
import { RadioGroupProvider } from './RadioContext';
import { useRadioGroup } from './useRadioGroup';
import BaseBox from '~components/Box/BaseBox';
import { FormHint, FormLabel } from '~components/Form';
import { SelectorGroupField } from '~components/Form/Selector/SelectorGroupField';
import { getPlatformType, makeSize, useBreakpoint } from '~utils';
import { useTheme } from '~components/BladeProvider';

type RadioGroupProps = {
  /**
   * Accepts multiple radios as children
   */
  children: React.ReactNode;
  /**
   * Help text of the radio group
   */
  helpText?: string;
  /**
   * Error text of the radio group
   * Renders when `validationState` is set to 'error'
   *
   * Overrides helpText
   */
  errorText?: string;
  /**
   * Sets the error state of the radioGroup
   * If set to `error` it will render the `errorText` of the group,
   * and propagate `invalid` prop to every radio
   */
  validationState?: 'error' | 'none';
  /**
   * Renders a necessity indicator after radioGroup label
   *
   * If set to `undefined` it renders nothing.
   */
  necessityIndicator?: 'required' | 'optional' | 'none';
  /**
   * Sets the disabled state of the radioGroup
   * If set to `true` it propagate down to all the radios
   *
   * @default false
   */
  isDisabled?: boolean;
  /**
   * Renders the label of the radio group
   */
  label: string;
  /**
   * Sets the position of the label
   *
   * @default 'top'
   */
  labelPosition?: 'top' | 'left';
  /**
   * Initial value of the radio group
   */
  defaultValue?: string;
  /**
   * value of the radio group
   *
   * Use `onChange` to update its value
   */
  value?: string;
  /**
   * The callback invoked when any of the radio's state changes
   */
  onChange?: ({ name, value }: { name: string | undefined; value: string }) => void;
  /**
   * The name of the input field in a radio
   * (Useful for form submission).
   */
  name?: string;
  /**
   * Size of the radios
   *
   * @default "medium"
   */
  size?: 'small' | 'medium';
};

const RadioGroup = ({
  children,
  label,
  helpText,
  isDisabled = false,
  necessityIndicator = 'none',
  labelPosition = 'top',
  validationState = 'none',
  errorText,
  name,
  defaultValue,
  onChange,
  value,
  size = 'medium',
}: RadioGroupProps): React.ReactElement => {
  const { contextValue, ids } = useRadioGroup({
    defaultValue,
    isDisabled,
    labelPosition,
    name,
    onChange,
    validationState,
    value,
    size,
  });

  const { theme } = useTheme();
  const { matchedDeviceType } = useBreakpoint({ breakpoints: theme.breakpoints });
  const showError = validationState === 'error' && errorText;
  const showHelpText = !showError && helpText;
  const accessibilityText = `${showError ? errorText : ''} ${showHelpText ? helpText : ''}`.trim();
  const isReactNative = getPlatformType() === 'react-native';
  const gap = radioSizes.group.gap[size][matchedDeviceType];
  const childCount = React.Children.count(children);

  return (
    <RadioGroupProvider value={contextValue}>
      <SelectorGroupField
        position={labelPosition}
        labelledBy={ids.labelId}
        accessibilityRole={isReactNative ? 'radiogroup' : 'group'}
        componentName="radio-group"
      >
        <FormLabel
          as="span"
          necessityIndicator={necessityIndicator}
          position={labelPosition}
          id={ids.labelId}
          accessibilityText={accessibilityText && `,${accessibilityText}`}
        >
          {label}
        </FormLabel>
        <BaseBox>
          <BaseBox display="flex" flexDirection="column">
            {React.Children.map(children, (child, index) => {
              return (
                <BaseBox
                  key={index}
                  {...{ marginBottom: index === childCount - 1 ? makeSize(0) : gap }}
                >
                  {child}
                </BaseBox>
              );
            })}
          </BaseBox>
          <FormHint
            type={validationState === 'error' ? 'error' : 'help'}
            errorText={errorText}
            helpText={helpText}
          />
        </BaseBox>
      </SelectorGroupField>
    </RadioGroupProvider>
  );
};

export { RadioGroup, RadioGroupProps };
