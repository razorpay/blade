import React from 'react';
import StyledVisuallyHidden from './StyledVisuallyHidden';

export type VisuallyHiddenProps = {
  children: React.ReactNode;
};

const VisuallyHidden = ({ children }: VisuallyHiddenProps): JSX.Element => {
  return <StyledVisuallyHidden>{children}</StyledVisuallyHidden>;
};

export default VisuallyHidden;
