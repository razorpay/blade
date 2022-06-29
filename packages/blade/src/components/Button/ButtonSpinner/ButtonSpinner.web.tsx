import React from 'react';
import styled from 'styled-components';
import Spinner from '../../Spinner/BaseSpinner';
import type { ButtonSpinnerProps } from './ButtonSpinner.d';
import { buttonSpinnerStyles, buttonSpinnerContainerStyles } from './buttonSpinnerStyles';

const StyledSpinner = styled(Spinner)(buttonSpinnerStyles);

const ButtonSpinnerContainer = styled.div<{ isHidden: boolean }>(({ isHidden }) => ({
  opacity: isHidden ? 0 : 1,
  ...buttonSpinnerContainerStyles,
}));

export const ButtonSpinner = ({
  isLoading,
  children,
  color,
  size,
}: ButtonSpinnerProps): React.ReactElement => {
  return (
    <>
      {isLoading ? <StyledSpinner color={color} size={size} /> : null}
      <ButtonSpinnerContainer isHidden={isLoading}>{children}</ButtonSpinnerContainer>
    </>
  );
};
