/* eslint-disable @typescript-eslint/no-shadow */
import React from 'react';
import isEmpty from 'lodash/isEmpty';
import type { OnChange } from './useRadio';
import { useRadio } from './useRadio';
import { RadioIcon } from './RadioIcon/RadioIcon';
import { useRadioGroupContext } from './RadioGroup/RadioContext';
import { radioHoverTokens } from './radioTokens';
import { SelectorLabel } from '~components/Form/Selector/SelectorLabel';
import BaseBox from '~components/Box/BaseBox';
import { SelectorTitle } from '~components/Form/Selector/SelectorTitle';
import { SelectorSupportText } from '~components/Form/Selector/SelectorSupportText';
import { SelectorInput } from '~components/Form/Selector/SelectorInput';
import { getStyledProps } from '~components/Box/styledProps';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import type { BladeElementRef, StringChildrenType, TestID } from '~utils/types';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { getPlatformType } from '~utils';
import { MetaConstants } from '~utils/metaAttribute';
import { throwBladeError } from '~utils/logger';

type RadioProps = {
  /**
   * Sets the label text of the Radio
   */
  children: StringChildrenType;
  /**
   * Help text for the Radio
   */
  helpText?: string;
  /**
   * The value to be used in the Radio input.
   * This is the value that will be returned on form submission.
   */
  value: string;
  /**
   * If `true`, the Radio will be disabled
   *
   * @default false
   */
  isDisabled?: boolean;
  /**
   * Size of the radios
   *
   * @default "medium"
   */
  size?: 'small' | 'medium';
} & TestID &
  StyledPropsBlade;

const _Radio: React.ForwardRefRenderFunction<BladeElementRef, RadioProps> = (
  { value, children, helpText, isDisabled, size = 'medium', testID, ...styledProps },
  ref,
) => {
  const groupProps = useRadioGroupContext();
  const isInsideGroup = !isEmpty(groupProps);

  if (__DEV__) {
    if (!isInsideGroup) {
      throwBladeError({
        moduleName: 'Radio',
        message: 'Cannot use <Radio /> outside of <RadioGroup />',
      });
    }
  }

  const isChecked = groupProps?.state?.isChecked(value);
  const defaultChecked =
    groupProps?.defaultValue === undefined ? undefined : groupProps?.defaultValue === value;
  const validationState = groupProps?.validationState;
  const hasError = validationState === 'error';
  const _isDisabled = isDisabled ?? groupProps?.isDisabled;
  const _isRequired = groupProps?.isRequired || groupProps?.necessityIndicator === 'required';
  const name = groupProps?.name;
  const showHelpText = !hasError && helpText;
  const isReactNative = getPlatformType() === 'react-native';
  const _size = groupProps.size ?? size;
  const isSmall = _size === 'small';

  const handleChange: OnChange = ({ isChecked, value }) => {
    if (isChecked) {
      groupProps?.state?.setValue(value!);
    } else {
      groupProps?.state?.removeValue();
    }
  };

  const { state, ids, inputProps } = useRadio({
    defaultChecked,
    isChecked,
    hasError,
    isDisabled: _isDisabled,
    isRequired: _isRequired,
    name,
    value,
    onChange: handleChange,
  });

  return (
    <BaseBox {...getStyledProps(styledProps)}>
      <SelectorLabel
        componentName={MetaConstants.RadioLabel}
        inputProps={isReactNative ? inputProps : {}}
        testID={testID}
      >
        <BaseBox display="flex" flexDirection="column">
          <BaseBox display="flex" alignItems="center" flexDirection="row">
            <SelectorInput
              hoverTokens={radioHoverTokens}
              isChecked={state.isChecked}
              isDisabled={_isDisabled}
              hasError={hasError}
              inputProps={inputProps}
              ref={ref}
            />
            <RadioIcon
              size={_size}
              isChecked={state.isChecked}
              isDisabled={_isDisabled}
              isNegative={hasError}
            />
            <SelectorTitle size={_size} isDisabled={_isDisabled}>
              {children}
            </SelectorTitle>
          </BaseBox>
          <BaseBox marginLeft={isSmall ? 'spacing.6' : 'spacing.7'}>
            {showHelpText && (
              <SelectorSupportText id={ids?.helpTextId}>{helpText}</SelectorSupportText>
            )}
          </BaseBox>
        </BaseBox>
      </SelectorLabel>
    </BaseBox>
  );
};

const Radio = assignWithoutSideEffects(React.forwardRef(_Radio), { displayName: 'Radio' });

export type { RadioProps };
export { Radio };
