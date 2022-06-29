import React from 'react';
import styled from 'styled-components';
import BaseSpinner from '../../Spinner/BaseSpinner';
import type { ButtonSpinnerProps } from './ButtonSpinner.d';
import { buttonSpinnerStyles, buttonSpinnerContainerStyles } from './buttonSpinnerStyles';

const ButtonBaseSpinner = styled(BaseSpinner)(buttonSpinnerStyles);

const ButtonSpinnerContainer = styled.div<{ isHidden: boolean }>(({ isHidden }) => ({
  opacity: isHidden ? 0 : 1,
  ...buttonSpinnerContainerStyles,
}));

const ButtonSpinner = ({
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

export default ButtonSpinner;
