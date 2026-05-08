import React, { useMemo } from 'react';
import type { InputGroupProps } from './types';
import { InputGroupProvider } from './InputGroupContext';
import type { BladeElementRef } from '~utils/types';
import BaseBox from '~components/Box/BaseBox';
import { useFormId } from '~components/Form/useFormId';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { getStyledProps } from '~components/Box/styledProps';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { FormLabel } from '~components/Form/FormLabel';
import { FormHint } from '~components/Form/FormHint';
import { useId } from '~utils/useId';
import { getHintType } from '~components/Input/BaseInput/BaseInput';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _InputGroup: React.ForwardRefRenderFunction<BladeElementRef, InputGroupProps> = (
  {
    label,
    size = 'medium',
    helpText,
    errorText,
    successText,
    validationState = 'none',
    isDisabled = false,
    children,
    testID,
    ...rest
  },
  ref,
) => {
  const contextValue = useMemo(
    () => ({
      isInsideInputGroup: true,
      size,
      isDisabled,
    }),
    [size, isDisabled],
  );

  const { inputId, helpTextId, errorTextId, successTextId } = useFormId('input-group');
  const idBase = useId('input-group');
  const labelId = `${idBase}-label`;

  const willRenderHintText =
    Boolean(helpText) ||
    (validationState === 'success' && Boolean(successText)) ||
    (validationState === 'error' && Boolean(errorText));

  return (
    <InputGroupProvider value={contextValue}>
      <BaseBox
        ref={ref as never}
        {...metaAttribute({ name: MetaConstants.InputGroup, testID })}
        {...getStyledProps(rest)}
        {...makeAnalyticsAttribute(rest)}
      >
        <BaseBox display="flex" flexDirection="column" width="100%">
          <BaseBox display="flex" flexDirection="column">
            {label && (
              <FormLabel as="label" position="top" id={labelId} htmlFor={inputId} size={size}>
                {label}
              </FormLabel>
            )}

            <BaseBox display="flex" flexDirection="column">
              {children}
            </BaseBox>
          </BaseBox>

          {willRenderHintText && (
            <BaseBox>
              <BaseBox display="flex" flexDirection="row" justifyContent="space-between">
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
            </BaseBox>
          )}
        </BaseBox>
      </BaseBox>
    </InputGroupProvider>
  );
};

const InputGroup = assignWithoutSideEffects(React.forwardRef(_InputGroup), {
  displayName: 'InputGroup',
  componentId: 'InputGroup',
});
export { InputGroup };
