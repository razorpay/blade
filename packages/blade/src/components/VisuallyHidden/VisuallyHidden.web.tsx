import React from 'react';
import styled from 'styled-components';
import screenReaderStyles from './ScreenReaderStyles';
import type { VisuallyHiddenProps } from './VisuallyHidden.d';

const StyledVisuallyHidden = styled.div(screenReaderStyles);

const VisuallyHidden = ({ children, ...props }: VisuallyHiddenProps): JSX.Element => {
  return <StyledVisuallyHidden {...props}>{children}</StyledVisuallyHidden>;
};

export default VisuallyHidden;
