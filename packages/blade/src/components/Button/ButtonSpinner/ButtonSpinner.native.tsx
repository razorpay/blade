import React from 'react';
import { View } from 'react-native';
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
      <View style={{ opacity: isLoading ? 0 : 1 }}>{children}</View>
    </>
  );
};

export default ButtonSpinner;
