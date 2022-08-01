import React from 'react';
import styled from 'styled-components/native';
import type { ButtonSpinnerProps } from './ButtonSpinner.d';
import { buttonSpinnerStyles, buttonSpinnerContainerStyles } from './buttonSpinnerStyles';
import Spinner from '~components/Spinner/Spinner';

const StyledSpinner = styled(Spinner)(buttonSpinnerStyles);

const ButtonSpinnerContainer = styled.View<{ isHidden: boolean }>(({ isHidden }) => ({
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
