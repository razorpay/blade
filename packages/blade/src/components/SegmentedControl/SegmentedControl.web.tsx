import React from 'react';
import styled from 'styled-components';
import type { SegmentedControlProps } from './types';
import { SegmentedControlContext } from './SegmentedControlContext';
import { SegmentedControlIndicator } from './SegmentedControlIndicator.web';
import { containerPadding, containerBorderRadius, gap } from './segmentedControlTokens';
import { useControllableState } from '~utils/useControllable';
import { useId } from '~utils/useId';
import { useMergeRefs } from '~utils/useMergeRefs';
import { makeAccessible } from '~utils/makeAccessible';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { makeSpace, useBreakpoint } from '~utils';
import getIn from '~utils/lodashButBetter/get';
import type { BladeElementRef } from '~utils/types';
import { FormLabel, FormHint } from '~components/Form';
import BaseBox from '~components/Box/BaseBox';
import { useTheme } from '~components/BladeProvider';
import { formHintLeftLabelMarginLeft } from '~components/Input/BaseInput/baseInputTokens';
import { makeSize } from '~utils/makeSize';
import { getHintType } from '~components/Input/BaseInput/BaseInput';

const StyledSegmentedControlContainer = styled.div<{
  $size: NonNullable<SegmentedControlProps['size']>;
}>(({ theme, $size }) => ({
  display: 'flex',
  width: '100%',
  alignItems: 'center',
  gap: makeSpace(getIn(theme, gap[$size])),
  padding: makeSpace(getIn(theme, containerPadding[$size])),
  backgroundColor: theme.colors.interactive.background.gray.faded,
  borderRadius: makeSpace(theme.border.radius[containerBorderRadius[$size]]),
  position: 'relative',
}));

const _SegmentedControl = (
  {
    children,
    defaultValue,
    value,
    onChange,
    size = 'medium',
    isDisabled = false,
    isRequired = false,
    name,
    label,
    accessibilityLabel,
    labelPosition = 'top',
    helpText,
    errorText,
    validationState = 'none',
    necessityIndicator = 'none',
    testID,
    ...rest
  }: SegmentedControlProps,
  ref: React.Ref<BladeElementRef>,
): React.ReactElement => {
  const [selectedValue, setSelectedValue] = useControllableState({
    defaultValue,
    value,
    onChange: (val) => {
      onChange?.({ name, value: val });
    },
  });

  const baseId = useId('segmented-control');
  const containerRef = React.useRef<HTMLDivElement>(null);
  const mergedRef = useMergeRefs(containerRef, ref as React.Ref<HTMLDivElement>);
  const itemRefs = React.useRef<Map<string, HTMLElement>>(new Map());
  const labelId = `${baseId}-label`;
  const totalItems = React.Children.count(children);

  const firstEnabledValue = React.useMemo(() => {
    let first: string | undefined;
    React.Children.forEach(children, (child) => {
      if (first !== undefined) return;
      if (React.isValidElement(child) && !child.props.isDisabled) {
        first = child.props.value;
      }
    });
    return first;
  }, [children]);

  const contextValue = React.useMemo(
    () => ({
      selectedValue,
      setSelectedValue,
      size,
      isDisabled,
      name,
      baseId,
      totalItems,
      firstEnabledValue,
      itemRefs,
    }),
    [
      selectedValue,
      setSelectedValue,
      size,
      isDisabled,
      name,
      baseId,
      totalItems,
      firstEnabledValue,
    ],
  );

  const { theme } = useTheme();
  const { matchedDeviceType } = useBreakpoint({ breakpoints: theme.breakpoints });
  const isLabelLeftPositioned = labelPosition === 'left' && matchedDeviceType === 'desktop';

  const willRenderHintText =
    Boolean(helpText) || (validationState === 'error' && Boolean(errorText));

  const showError = validationState === 'error' && errorText;
  const showHelpText = !showError && helpText;
  const accessibilityText = `${showError ? errorText : ''} ${showHelpText ? helpText : ''}`.trim();
  const ariaLabel = label ? undefined : accessibilityLabel || name;

  const segmentedControlElement = (
    <StyledSegmentedControlContainer
      ref={mergedRef}
      $size={size}
      {...makeAccessible({
        role: 'radiogroup',
        labelledBy: label ? labelId : undefined,
        label: ariaLabel,
        required: isRequired,
      })}
      {...metaAttribute({ name: MetaConstants.SegmentedControl, testID })}
      {...makeAnalyticsAttribute(rest)}
    >
      {children}
      <SegmentedControlIndicator containerRef={containerRef} />
    </StyledSegmentedControlContainer>
  );

  return (
    <SegmentedControlContext.Provider value={contextValue}>
      <BaseBox display="flex" flexDirection="column" width="100%">
        <BaseBox
          display="flex"
          flexDirection={isLabelLeftPositioned ? 'row' : 'column'}
          alignItems={isLabelLeftPositioned ? 'center' : undefined}
        >
          {label ? (
            <FormLabel
              as="span"
              necessityIndicator={necessityIndicator}
              position={labelPosition}
              id={labelId}
              accessibilityText={accessibilityText && `,${accessibilityText}`}
              size={size}
            >
              {label}
            </FormLabel>
          ) : null}

          <BaseBox display="flex" flexDirection="column" flex="1">
            {segmentedControlElement}
          </BaseBox>
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
              size={size}
            />
          </BaseBox>
        )}
      </BaseBox>
    </SegmentedControlContext.Provider>
  );
};

const SegmentedControl = React.forwardRef(_SegmentedControl);

export { SegmentedControl };
