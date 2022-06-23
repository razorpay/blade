import React from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';
import useIconProps from '../../Icons/useIconProps';
import BaseSpinner from '../../Spinner/BaseSpinner';
import type { ButtonSpinnerProps } from './ButtonSpinner.d';
import { buttonSpinnerStyles, buttonSpinnerContainerStyles } from './buttonSpinnerStyles';

const ButtonBaseSpinner = styled(BaseSpinner)(buttonSpinnerStyles);

const ButtonSpinnerContainer = styled(View)<{ isHidden: boolean }>(({ isHidden }) => ({
  opacity: isHidden ? 0 : 1,
  ...buttonSpinnerContainerStyles,
}));

const ButtonSpinner = ({
  isLoading,
  children,
  color,
  size,
}: ButtonSpinnerProps): React.ReactElement => {
  const { width, iconColor } = useIconProps({ size, color });

  return (
    <>
      {isLoading ? <ButtonBaseSpinner color={iconColor} size={width} /> : null}
      <ButtonSpinnerContainer isHidden={isLoading}>{children}</ButtonSpinnerContainer>
    </>
  );
};

export default ButtonSpinner;
