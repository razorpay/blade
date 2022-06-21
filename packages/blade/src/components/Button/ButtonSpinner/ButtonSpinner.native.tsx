import React from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';
import BaseSpinner from '../../Spinner/BaseSpinner';
import type { ButtonSpinnerProps } from './ButtonSpinner.d';
import buttonSpinnerStyles from './buttonSpinnerStyles';

const ButtonBaseSpinner = styled(BaseSpinner)(buttonSpinnerStyles);

const ButtonSpinner = ({
  isLoading,
  children,
  color,
  size,
}: ButtonSpinnerProps): React.ReactElement => {
  return (
    <>
      {isLoading ? <ButtonBaseSpinner color={color} size={size} /> : null}
      <View style={{ opacity: isLoading ? 0 : 1 }}>{children}</View>
    </>
  );
};

export default ButtonSpinner;
