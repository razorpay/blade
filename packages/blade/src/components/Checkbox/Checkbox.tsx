/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-shadow */
import React from 'react';
import { useCheckboxGroupContext } from './CheckboxGroup/CheckboxGroupContext';
import { CheckboxIcon } from './CheckboxIcon';
import { useCheckbox } from './useCheckbox';
import { checkboxHoverTokens, checkboxSizes } from './checkboxTokens';
import isEmpty from '~utils/lodashButBetter/isEmpty';
import isUndefined from '~utils/lodashButBetter/isUndefined';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { getStyledProps } from '~components/Box/styledProps';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import BaseBox from '~components/Box/BaseBox';
import { FormHint } from '~components/Form';
import { SelectorLabel } from '~components/Form/Selector/SelectorLabel';
import { SelectorTitle } from '~components/Form/Selector/SelectorTitle';
import { SelectorSupportText } from '~components/Form/Selector/SelectorSupportText';
import { SelectorInput } from '~components/Form/Selector/SelectorInput';
import type { BladeElementRef, DataAnalyticsAttribute, TestID } from '~utils/types';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { throwBladeError } from '~utils/logger';
import { makeSize, useTheme } from '~utils';
import { getInnerMotionRef, getOuterMotionRef } from '~utils/getMotionRefs';
import type { MotionMetaProp } from '~components/BaseMotion';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';

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
  children?: React.ReactNode;
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
  size?: 'small' | 'medium' | 'large';
  /**
   * Sets the tab-index property on checkbox element
   *
   */
  tabIndex?: number;
} & TestID &
  DataAnalyticsAttribute &
  StyledPropsBlade &
  MotionMetaProp;

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
    tabIndex,
    testID,
    _motionMeta,
    ...rest
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

  if (__DEV__) {
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

      throwBladeError({
        message: `Cannot set \`${props}\` on <Checkbox /> when it's inside <CheckboxGroup />, Please set it on the <CheckboxGroup /> itself`,
        moduleName: 'Checkbox',
      });
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
  }

  const _validationState = validationState ?? groupProps?.validationState;
  const _hasError = _validationState === 'error';
  const _isDisabled = isDisabled ?? groupProps?.isDisabled;
  const _isRequired = Boolean(
    isRequired || groupProps?.isRequired || groupProps?.necessityIndicator === 'required',
  );
  const _name = name ?? groupProps?.name;
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  const _isChecked = isChecked ?? groupProps?.state?.isChecked(value!);
  const _size = groupProps.size ?? size;
  const { theme } = useTheme();
  const formHintSize = {
    small: 'medium',
    medium: 'medium',
    large: 'large',
  } as const;

  const showSupportingText = helpText;

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
    isRequired: _isRequired,
    name: _name,
    value,
    onChange: handleChange,
  });

  // Checkbox icon's size & margin + margin-left of SelectorTitle which is 2
  const helpTextLeftSpacing = makeSize(checkboxSizes.icon[size].width + theme.spacing[3]);

  return (
    <BaseBox
      ref={getOuterMotionRef({ _motionMeta, ref })}
      {...metaAttribute({ name: MetaConstants.Checkbox, testID })}
      {...getStyledProps(rest)}
    >
      <SelectorLabel
        componentName={MetaConstants.CheckboxLabel}
        inputProps={state.isReactNative ? inputProps : {}}
        style={{ cursor: isDisabled ? 'not-allowed' : 'pointer' }}
      >
        <BaseBox display="flex" flexDirection="column">
          <BaseBox display="flex" flexDirection="row">
            <SelectorInput
              hoverTokens={checkboxHoverTokens}
              isChecked={state.isChecked || Boolean(isIndeterminate)}
              isDisabled={_isDisabled}
              hasError={_hasError}
              inputProps={inputProps}
              tabIndex={tabIndex}
              ref={getInnerMotionRef({ _motionMeta, ref })}
              {...makeAnalyticsAttribute(rest)}
            />
            <CheckboxIcon
              size={_size}
              isChecked={state.isChecked}
              isIndeterminate={isIndeterminate}
              isDisabled={_isDisabled}
              isNegative={_hasError}
            />
            {children ? (
              <SelectorTitle size={_size} isDisabled={_isDisabled}>
                {children}
              </SelectorTitle>
            ) : null}
          </BaseBox>
          {showSupportingText ? (
            <BaseBox marginLeft={helpTextLeftSpacing}>
              <SelectorSupportText size={_size} id={ids?.helpTextId}>
                {helpText}
              </SelectorSupportText>
            </BaseBox>
          ) : null}
        </BaseBox>
      </SelectorLabel>
      <FormHint
        size={formHintSize[_size]}
        errorText={errorText}
        errorTextId={ids?.errorTextId}
        type={validationState === 'error' ? 'error' : 'help'}
      />
    </BaseBox>
  );
};

const Checkbox = assignWithoutSideEffects(React.forwardRef(_Checkbox), {
  displayName: 'Checkbox',
});

export type { CheckboxProps };
export { Checkbox };
