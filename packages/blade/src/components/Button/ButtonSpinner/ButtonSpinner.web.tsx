import React from 'react';
import styled from 'styled-components';
import useIconProps from '../../Icons/useIconProps';
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
  const { width, iconColor } = useIconProps({ size, color });

  return (
    <>
      {isLoading ? <ButtonBaseSpinner color={iconColor} size={width} /> : null}
      <div style={{ opacity: isLoading ? 0 : 1 }}>{children}</div>
    </>
  );
};

export default ButtonSpinner;
