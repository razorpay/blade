import React from 'react';
import styled from 'styled-components/native';
import { screenReaderStyles } from './ScreenReaderStyles';
import type { VisuallyHiddenProps } from './VisuallyHidden.d';

const StyledVisuallyHidden = styled.View(screenReaderStyles);

export const VisuallyHidden = ({ children }: VisuallyHiddenProps): JSX.Element => {
  return <StyledVisuallyHidden>{children}</StyledVisuallyHidden>;
};
