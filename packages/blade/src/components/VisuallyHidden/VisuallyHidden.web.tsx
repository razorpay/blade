import React from 'react';
import styled from 'styled-components';
import { screenReaderStyles } from './ScreenReaderStyles';
import type { VisuallyHiddenProps } from './types';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';

const StyledVisuallyHidden = styled.div(screenReaderStyles);

export const VisuallyHidden = ({ children, testID }: VisuallyHiddenProps): React.ReactElement => {
  return (
    <StyledVisuallyHidden {...metaAttribute({ name: MetaConstants.VisuallyHidden, testID })}>
      {children}
    </StyledVisuallyHidden>
  );
};
