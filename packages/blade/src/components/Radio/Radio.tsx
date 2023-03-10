/* eslint-disable @typescript-eslint/no-shadow */
import React from 'react';
import isEmpty from 'lodash/isEmpty';
import type { OnChange } from './useRadio';
import { useRadio } from './useRadio';
import { RadioIcon } from './RadioIcon/RadioIcon';
import { useRadioGroupContext } from './RadioGroup/RadioContext';
import { SelectorLabel } from '~components/Form/Selector/SelectorLabel';
import BaseBox from '~components/Box/BaseBox';
import { SelectorTitle } from '~components/Form/Selector/SelectorTitle';
import { SelectorSupportText } from '~components/Form/Selector/SelectorSupportText';
import { SelectorInput } from '~components/Form/Selector/SelectorInput';
import { getPlatformType } from '~utils';
import type { BladeElementRef } from '~src/hooks/useBladeInnerRef';
import type { StringChildrenType } from '~src/_helpers/types';

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
};

const _Radio: React.ForwardRefRenderFunction<BladeElementRef, RadioProps> = (
  { value, children, helpText, isDisabled, size = 'medium' },
  ref,
) => {
  const groupProps = useRadioGroupContext();
  const isInsideGroup = !isEmpty(groupProps);

  if (!isInsideGroup) {
    throw new Error('[Blade Radio]: Cannot use <Radio /> outside of <RadioGroup />');
  }

  const isChecked = groupProps?.state?.isChecked(value);
  const defaultChecked =
    groupProps?.defaultValue === undefined ? undefined : groupProps?.defaultValue === value;
  const validationState = groupProps?.validationState;
  const hasError = validationState === 'error';
  const _isDisabled = isDisabled ?? groupProps?.isDisabled;
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
    isRequired: groupProps.necessityIndicator === 'required',
    name,
    value,
    onChange: handleChange,
  });

  return (
    <SelectorLabel inputProps={isReactNative ? inputProps : {}}>
      <BaseBox display="flex" flexDirection="column">
        <BaseBox display="flex" alignItems="center" flexDirection="row">
          <SelectorInput
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
  );
};

const Radio = /*#__PURE__*/ Object.assign(React.forwardRef(_Radio), { displayName: 'Radio' });

export { Radio, RadioProps };
