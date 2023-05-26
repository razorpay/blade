// Selector* components are used in Checkbox/Radio
import React from 'react';
import styled from 'styled-components';
import type { SelectorLabelProps } from './types';
import { makeSpace, metaAttribute } from '~utils';

const StyledSelectorLabel = styled.label(({ theme }) => {
  return {
    display: 'flex',
    marginTop: makeSpace(theme.spacing[1]),
    marginBottom: makeSpace(theme.spacing[1]),
  };
});

const SelectorLabel = ({
  children,
  componentName,
  testID,
  onMouseDown,
  onMouseUp,
  onMouseOut,
  onKeyDown,
  onKeyUp,
  onTouchStart,
  onTouchEnd,
  style,
}: SelectorLabelProps): React.ReactElement => {
  return (
    <StyledSelectorLabel
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onMouseDown={(e) => {
        e.preventDefault();
        onMouseDown?.(e);
      }}
      onMouseUp={onMouseUp}
      onMouseOut={onMouseOut}
      onKeyDown={onKeyDown}
      onKeyUp={onKeyUp}
      style={style}
      {...metaAttribute({ name: componentName, testID })}
    >
      {children}
    </StyledSelectorLabel>
  );
};

export { SelectorLabel };
