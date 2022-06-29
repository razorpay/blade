import React from 'react';
import styled from 'styled-components/native';
import Spinner from '../../Spinner/BaseSpinner';
import type { ButtonSpinnerProps } from './ButtonSpinner.d';
import { buttonSpinnerStyles, buttonSpinnerContainerStyles } from './buttonSpinnerStyles';

const ButtonBaseSpinner = styled(Spinner)(buttonSpinnerStyles);

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
      {isLoading ? <ButtonBaseSpinner color={color} size={size} /> : null}
      <ButtonSpinnerContainer isHidden={isLoading}>{children}</ButtonSpinnerContainer>
    </>
  );
};
