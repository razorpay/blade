import React from 'react';
import { LoaderIcon } from '../../Icons';
import type { ButtonSpinnerProps } from './ButtonSpinner.d';
import StyledButtonSpinner from './StyledButtonSpinner';

const ButtonSpinner = ({
  isLoading,
  children,
  color,
  size,
}: ButtonSpinnerProps): React.ReactElement => {
  return (
    <>
      {isLoading ? (
        <StyledButtonSpinner>
          <LoaderIcon color={color} size={size} />
        </StyledButtonSpinner>
      ) : null}
      <div style={{ opacity: isLoading ? 0 : 1 }}>{children}</div>
    </>
  );
};

export default ButtonSpinner;
