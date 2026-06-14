import React from 'react';
import { Composite } from '@floating-ui/react';
import type { SegmentedControlProps } from './types';
import { SegmentedControlProvider } from './SegmentedControlContext';
import { useSegmentedControl } from './useSegmentedControl';
import { SegmentedControlIndicator } from './SegmentedControlIndicator';
import {
  trackBackgroundColor,
  trackBorderRadius,
  trackGap,
  trackPadding,
} from './segmentedControlTokens';
import BaseBox from '~components/Box/BaseBox';
import { FormHint, FormLabel } from '~components/Form';
import { SelectorGroupField } from '~components/Form/Selector/SelectorGroupField';
import { getStyledProps } from '~components/Box/styledProps';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { makeAccessible } from '~utils/makeAccessible';

const SegmentedControl = ({
  children,
  label,
  accessibilityLabel,
  labelPosition = 'top',
  value,
  defaultValue,
  onChange,
  name,
  isRequired = false,
  isDisabled = false,
  size = 'medium',
  isFullWidth = false,
  validationState = 'none',
  helpText,
  errorText,
  testID,
  ...rest
}: SegmentedControlProps): React.ReactElement => {
  const { contextValue, ids } = useSegmentedControl({
    value,
    defaultValue,
    onChange,
    name,
    isDisabled,
    size,
  });

  const containerRef = React.useRef<HTMLDivElement>(null);
  const showError = validationState === 'error' && errorText;
  const showHelpText = !showError && helpText;
  const accessibilityText = `${showError ? errorText : ''} ${showHelpText ? helpText : ''}`.trim();

  return (
    <SegmentedControlProvider value={contextValue}>
      <BaseBox {...getStyledProps(rest)} width={isFullWidth ? '100%' : undefined}>
        <SelectorGroupField
          position={labelPosition}
          labelledBy={ids.labelId}
          accessibilityRole="radiogroup"
          componentName="segmented-control"
          testID={testID}
          {...makeAnalyticsAttribute(rest)}
        >
          {label ? (
            <FormLabel
              as="span"
              necessityIndicator={isRequired ? 'required' : 'none'}
              position={labelPosition}
              id={ids.labelId}
              accessibilityText={accessibilityText && `,${accessibilityText}`}
              size={size}
            >
              {label}
            </FormLabel>
          ) : null}
          <BaseBox>
            <BaseBox position="relative">
              <Composite
                render={(htmlProps) => (
                  // @ts-expect-error spreading composite props
                  <BaseBox
                    {...htmlProps}
                    ref={containerRef}
                    display="flex"
                    flexDirection="row"
                    alignItems="center"
                    borderRadius={trackBorderRadius}
                    borderWidth="none"
                    padding={trackPadding[size]}
                    gap={trackGap}
                    backgroundColor={trackBackgroundColor}
                    width={isFullWidth ? '100%' : undefined}
                    {...(accessibilityLabel ? makeAccessible({ label: accessibilityLabel }) : {})}
                    {...metaAttribute({
                      name: MetaConstants.SegmentedControl,
                      testID,
                    })}
                  >
                    {children}
                  </BaseBox>
                )}
              />
              <SegmentedControlIndicator containerRef={containerRef} />
            </BaseBox>
            <FormHint
              size={size}
              type={
                validationState === 'error'
                  ? 'error'
                  : validationState === 'success'
                  ? 'success'
                  : 'help'
              }
              errorText={errorText}
              helpText={helpText}
              successText={validationState === 'success' ? helpText : undefined}
            />
          </BaseBox>
        </SelectorGroupField>
      </BaseBox>
    </SegmentedControlProvider>
  );
};

export { SegmentedControl };
