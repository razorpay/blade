import React, { useMemo } from 'react';
import type { InputGroupProps } from './types';
import { StyledInputGroup } from './StyledInputGroup';
import { InputGroupProvider } from './InputGroupContext';
import { formHintLeftLabelMarginLeft } from '~components/Input/BaseInput/baseInputTokens';
import type { BladeElementRef } from '~utils/types';
import BaseBox from '~components/Box/BaseBox';
import { useTheme } from '~components/BladeProvider';
import { useBreakpoint } from '~utils';
import { useFormId } from '~components/Form/useFormId';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { getStyledProps } from '~components/Box/styledProps';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { FormLabel } from '~components/Form/FormLabel';
import { FormHint } from '~components/Form/FormHint';
import { makeSize } from '~utils/makeSize';
import { useId } from '~utils/useId';
import { getHintType } from '~components/Input/BaseInput/BaseInput';
import { getOuterMotionRef } from '~utils/getMotionRefs';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _InputGroup = (
  {
    label,
    labelPosition = 'top',
    size = 'medium',
    helpText,
    errorText,
    successText,
    validationState = 'none',
    isDisabled = false,
    children,
    testID,
    _motionMeta,
    ...rest
  }: InputGroupProps,
  ref: React.Ref<BladeElementRef>,
): React.ReactElement => {
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
  const { theme } = useTheme();
  const { matchedDeviceType } = useBreakpoint({ breakpoints: theme.breakpoints });
  const isLabelLeftPositioned = labelPosition === 'left' && matchedDeviceType === 'desktop';

  const willRenderHintText =
    Boolean(helpText) ||
    (validationState === 'success' && Boolean(successText)) ||
    (validationState === 'error' && Boolean(errorText));

  const totalInputRows = React.Children.count(children);

  return (
    <InputGroupProvider value={contextValue}>
      <StyledInputGroup
        ref={getOuterMotionRef({ _motionMeta, ref })}
        {...metaAttribute({ name: MetaConstants.InputGroup, testID })}
        {...getStyledProps(rest)}
        {...makeAnalyticsAttribute(rest)}
      >
        <BaseBox
          display="flex"
          flexDirection="column"
          width="100%"
          data-testid={testID}
          role="group"
        >
          <BaseBox
            display="flex"
            flexDirection={isLabelLeftPositioned ? 'row' : 'column'}
            alignItems={isLabelLeftPositioned && totalInputRows < 2 ? 'center' : undefined}
          >
            {label && (
              <FormLabel
                as="label"
                position={labelPosition}
                id={labelId}
                htmlFor={inputId}
                size={size}
              >
                {label}
              </FormLabel>
            )}

            <BaseBox display="flex" flexDirection="column">
              {children}
            </BaseBox>
          </BaseBox>

          {willRenderHintText && (
            <BaseBox
              marginLeft={makeSize(
                label && isLabelLeftPositioned ? formHintLeftLabelMarginLeft[size] : 0,
              )}
            >
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
      </StyledInputGroup>
    </InputGroupProvider>
  );
};

const InputGroup = assignWithoutSideEffects(React.forwardRef(_InputGroup), {
  displayName: 'InputGroup',
  componentId: 'InputGroup',
});
export { InputGroup };
