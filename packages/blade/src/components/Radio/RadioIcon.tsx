/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react';
import { useTheme } from '~components/BladeProvider';
import Svg from '~components/Icons/_Svg';
import { getIn } from '~utils';
import { CheckboxIconWrapper } from '~components/Checkbox/CheckboxIcon/CheckboxIconWrapper';
import Circle from '~components/Icons/_Svg/Circle';

const CheckedIcon = ({ color }: { color: string }) => {
  return (
    <Svg width="16px" height="16px" viewBox="0 0 16 16" fill="none">
      <Circle cx="8" cy="8" r="7.5" fill={color} stroke={color} />
      <Circle cx="8" cy="8" r="4" fill="white" />
    </Svg>
  );
};

export type RadioIconProps = {
  isFocused?: boolean;
  isDisabled?: boolean;
  isNegative?: boolean;
  isChecked?: boolean;
};

const RadioIcon = ({ isChecked, isDisabled, isNegative }: RadioIconProps) => {
  const { theme } = useTheme();
  const defaultIconColor = getIn(theme, 'colors.brand.primary.200');
  const disabledIconColor = getIn(theme, 'colors.brand.gray.500');
  const iconColor = isDisabled ? disabledIconColor : defaultIconColor;

  return (
    <CheckboxIconWrapper
      isFullRounded={true}
      isDisabled={isDisabled}
      isNegative={isNegative}
      isChecked={!!isChecked}
    >
      {isChecked ? <CheckedIcon color={iconColor} /> : null}
    </CheckboxIconWrapper>
  );
};

export { RadioIcon };
