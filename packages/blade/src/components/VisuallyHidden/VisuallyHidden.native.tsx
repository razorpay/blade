import React from 'react';
import styled from 'styled-components/native';
import screenReaderStyles from './ScreenReaderStyles';
import type { VisuallyHiddenProps } from './VisuallyHidden.d';

const StyledVisuallyHidden = styled.View(screenReaderStyles);

export const VisuallyHidden = ({ children, ...props }: VisuallyHiddenProps): JSX.Element => {
  return <StyledVisuallyHidden {...props}>{children}</StyledVisuallyHidden>;
};

export default VisuallyHidden;
