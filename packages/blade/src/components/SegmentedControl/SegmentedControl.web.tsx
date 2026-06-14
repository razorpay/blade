import React from 'react';
import styled from 'styled-components';
import type { SegmentedControlProps } from './types';
import { SegmentedControlContext } from './SegmentedControlContext';
import { containerPadding, gap } from './segmentedControlTokens';
import { useControllableState } from '~utils/useControllable';
import { makeAccessible } from '~utils/makeAccessible';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { makeSpace } from '~utils';
import getIn from '~utils/lodashButBetter/get';
import type { BladeElementRef } from '~utils/types';

const StyledSegmentedControlContainer = styled.div<{
  $size: NonNullable<SegmentedControlProps['size']>;
}>(({ theme, $size }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: makeSpace(getIn(theme, gap[$size])),
  padding: makeSpace(getIn(theme, containerPadding[$size])),
  backgroundColor: theme.colors.surface.background.gray.subtle,
  borderRadius: makeSpace(theme.border.radius.medium),
  position: 'relative',
}));

const _SegmentedControl = (
  {
    children,
    defaultValue,
    value,
    onChange,
    size = 'medium',
    isFullWidth = false,
    isDisabled = false,
    name,
    testID,
    ...rest
  }: SegmentedControlProps,
  ref: React.Ref<BladeElementRef>,
): React.ReactElement => {
  const [selectedValue, setSelectedValue] = useControllableState({
    defaultValue,
    value,
    onChange: (val) => {
      onChange?.(val);
    },
  });

  const contextValue = React.useMemo(
    () => ({
      selectedValue,
      setSelectedValue,
      size,
      isDisabled,
      isFullWidth,
      name,
    }),
    [selectedValue, setSelectedValue, size, isDisabled, isFullWidth, name],
  );

  return (
    <SegmentedControlContext.Provider value={contextValue}>
      <StyledSegmentedControlContainer
        ref={ref as never}
        $size={size}
        style={isFullWidth ? { display: 'flex', width: '100%' } : undefined}
        {...makeAccessible({ role: 'radiogroup', label: name })}
        {...metaAttribute({ name: MetaConstants.SegmentedControl, testID })}
        {...makeAnalyticsAttribute(rest)}
      >
        {children}
      </StyledSegmentedControlContainer>
    </SegmentedControlContext.Provider>
  );
};

const SegmentedControl = React.forwardRef(_SegmentedControl);

export { SegmentedControl };
