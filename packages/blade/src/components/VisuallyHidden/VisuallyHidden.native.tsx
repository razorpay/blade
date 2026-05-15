import React from 'react';
import styled from 'styled-components/native';

import { metaAttribute, MetaConstants } from '~utils/metaAttribute';

import { screenReaderStyles } from './ScreenReaderStyles';

import type { VisuallyHiddenProps } from './types';

const StyledVisuallyHidden = styled.View(screenReaderStyles);

export const VisuallyHidden = ({ children, testID }: VisuallyHiddenProps): React.ReactElement => {
  return (
    <StyledVisuallyHidden {...metaAttribute({ name: MetaConstants.VisuallyHidden, testID })}>
      {children}
    </StyledVisuallyHidden>
  );
};
