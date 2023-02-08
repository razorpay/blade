/* eslint-disable @typescript-eslint/no-shadow */
import React from 'react';
import isUndefined from 'lodash/isUndefined';
import { useCheckboxGroupContext } from './CheckboxGroup/CheckboxGroupContext';
import { CheckboxIcon } from './CheckboxIcon';
import { useCheckbox } from './useCheckbox';
import { metaAttribute, isEmpty, MetaConstants } from '~utils';
import BaseBox from '~components/Box/BaseBox';
import { FormHint } from '~components/Form';
import { SelectorLabel } from '~components/Form/Selector/SelectorLabel';
import { SelectorTitle } from '~components/Form/Selector/SelectorTitle';
import { SelectorSupportText } from '~components/Form/Selector/SelectorSupportText';
import { SelectorInput } from '~components/Form/Selector/SelectorInput';
import type { BladeElementRef } from '~src/hooks/useBladeInnerRef';

type OnChange = ({
  isChecked,
  event,
  value,
}: {
  isChecked: boolean;
  event?: React.ChangeEvent;
  value?: string;
}) => void;

type CheckboxProps = {
  /**
   * If `true`, The checkbox will be checked. This also makes the checkbox controlled
   * Use `onChange` to update its value
   *
   * @default false
   */
  isChecked?: boolean;
  /**
   * If `true`, the checkbox will be initially checked. This also makes the checkbox uncontrolled
   *
   * @default false
   */
  defaultChecked?: boolean;
  /**
   * The callback invoked when the checked state of the `Checkbox` changes.
   */
  onChange?: OnChange;
  /**
   * Sets the label of the checkbox
   */
  children: React.ReactNode;
  /**
   * Help text for the checkbox
   */
  helpText?: string;
  /**
   * Error text for the checkbox
   *
   * Renders when `validationState` is set to 'error'
   */
  errorText?: string;
  /**
   * If `true`, the checkbox will be indeterminate.
   * This does not modify the isChecked property.
   *
   * @default false
   */
  isIndeterminate?: boolean;
  /**
   * The name of the input field in a checkbox
   * (Useful for form submission).
   */
  name?: string;
  /**
   * The value to be used in the checkbox input.
   * This is the value that will be returned on form submission.
   */
  value?: string;
  /**
   * If `true`, the checkbox will be disabled
   *
   * @default false
   */
  isDisabled?: boolean;
  /**
   * If `true`, the checkbox input is marked as required,
   * and `required` attribute will be added
   *
   * @default false
   */
  isRequired?: boolean;
  /**
   * If `error`, the checkbox input is marked as invalid,
   * and `invalid` attribute will be added
   */
  validationState?: 'error' | 'none';
  /**
   * Size of the checkbox
   *
   * @default "medium"
   */
  size?: 'small' | 'medium';
};

const _Checkbox: React.ForwardRefRenderFunction<BladeElementRef, CheckboxProps> = (
  {
    defaultChecked,
    validationState,
    isChecked,
    isDisabled,
    isIndeterminate,
    isRequired,
    name,
    onChange,
    value,
    children,
    helpText,
    errorText,
    size = 'medium',
  },
  ref,
) => {
  const groupProps = useCheckboxGroupContext();

  // ban certain props in checkbox while inside group
  const hasValidationState = !isUndefined(validationState);
  const hasName = !isUndefined(name);
  const hasDefaultChecked = !isUndefined(defaultChecked);
  const hasIsChecked = !isUndefined(isChecked);
  const hasOnChange = !isUndefined(onChange);
  if (
    (hasValidationState || hasName || hasDefaultChecked || hasIsChecked || hasOnChange) &&
    !isEmpty(groupProps)
  ) {
    const props = [
      hasValidationState ? 'validationState' : undefined,
      hasName ? 'name' : undefined,
      hasDefaultChecked ? 'defaultChecked' : undefined,
      hasIsChecked ? 'isChecked' : undefined,
      hasOnChange ? 'onChange' : undefined,
    ]
      .filter(Boolean)
      .join(',');

    throw new Error(
      `[Blade Checkbox]: Cannot set \`${props}\` on <Checkbox /> when it's inside <CheckboxGroup />, Please set it on the <CheckboxGroup /> itself`,
    );
  }

  // mandate value prop when using inside group
  if (!value && !isEmpty(groupProps)) {
    throw new Error(
      `[Blade Checkbox]: <CheckboxGroup /> requires that you pass unique "value" prop to each <Checkbox />
      <CheckboxGroup>
        <Checkbox value="apple">Apple</Checkbox>
        <Checkbox value="mango">Mango</Checkbox>
      </CheckboxGroup>
      `,
    );
  }

  const _validationState = validationState ?? groupProps?.validationState;
  const _hasError = _validationState === 'error';
  const _isDisabled = isDisabled ?? groupProps?.isDisabled;
  const _name = name ?? groupProps?.name;
  const _isChecked = isChecked ?? groupProps?.state?.isChecked(value!);
  const _size = groupProps.size ?? size;
  const isSmall = _size === 'small';

  // only show error when the self validation is set to error
  // Since we don't want to show errorText inside the group
  const showSupportingText = validationState !== 'error' && helpText;

  const handleChange: OnChange = ({ isChecked, event, value }) => {
    if (isChecked) {
      groupProps?.state?.addValue(value!);
    } else {
      groupProps?.state?.removeValue(value!);
    }

    onChange?.({ isChecked, event, value });
  };

  const { state, ids, inputProps } = useCheckbox({
    defaultChecked,
    isChecked: _isChecked,
    isIndeterminate,
    hasError: _hasError,
    hasHelperText: Boolean(showSupportingText),
    isDisabled: _isDisabled,
    isRequired,
    name: _name,
    value,
    onChange: handleChange,
  });

  return (
    <BaseBox {...metaAttribute(MetaConstants.Component, MetaConstants.Checkbox)}>
      <SelectorLabel inputProps={state.isReactNative ? inputProps : {}}>
        <BaseBox display="flex" flexDirection="column">
          <BaseBox display="flex" alignItems="center" flexDirection="row">
            <SelectorInput
              isChecked={state.isChecked || Boolean(isIndeterminate)}
              isDisabled={_isDisabled}
              hasError={_hasError}
              inputProps={inputProps}
              ref={ref}
            />
            <CheckboxIcon
              size={_size}
              isChecked={state.isChecked}
              isIndeterminate={isIndeterminate}
              isDisabled={_isDisabled}
              isNegative={_hasError}
            />
            <SelectorTitle size={_size} isDisabled={_isDisabled}>
              {children}
            </SelectorTitle>
          </BaseBox>
          <BaseBox marginLeft={isSmall ? 'spacing.6' : 'spacing.7'}>
            {showSupportingText && (
              <SelectorSupportText id={ids?.helpTextId}>{helpText}</SelectorSupportText>
            )}
          </BaseBox>
        </BaseBox>
      </SelectorLabel>
      <FormHint
        errorText={errorText}
        errorTextId={ids?.errorTextId}
        type={validationState === 'error' ? 'error' : 'help'}
      />
    </BaseBox>
  );
};

const Checkbox = React.forwardRef(_Checkbox);
Checkbox.displayName = 'Checkbox';

export { Checkbox, CheckboxProps };
