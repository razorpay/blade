/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react';
import { RadioIconWrapper } from './RadioIconWrapper';
import { Fade } from './Fade';
import { useTheme } from '~components/BladeProvider';
import Svg from '~components/Icons/_Svg';
import Circle from '~components/Icons/_Svg/Circle';
import { getIn } from '~utils';

const CheckedIcon = ({ dotColor, noDot }: { dotColor: string; noDot?: boolean }) => {
  return (
    <Svg width="16px" height="16px" viewBox="0 0 16 16" fill="none">
      {!noDot && <Circle cx="8" cy="8" r="4" fill={dotColor} />}
    </Svg>
  );
};

export type RadioIconProps = {
  isDisabled?: boolean;
  isNegative?: boolean;
  isChecked?: boolean;
};

// Radio icon center dot color
const variants = {
  unchecked: {
    default: 'colors.brand.gray.200',
    disabled: 'colors.brand.gray.300',
    negative: 'colors.feedback.background.negative.lowContrast',
  },
  checked: {
    default: 'colors.brand.gray.200',
    disabled: 'colors.brand.gray.400',
    negative: 'colors.feedback.background.negative.highContrast',
  },
};

const RadioIcon = ({ isChecked, isDisabled, isNegative }: RadioIconProps) => {
  const { theme } = useTheme();

  const checked = Boolean(isChecked);
  const state = checked ? 'checked' : 'unchecked';
  let variant: 'default' | 'disabled' | 'negative' = 'default';
  if (isDisabled) variant = 'disabled';
  if (isNegative) variant = 'negative';
  const dotColor = getIn(theme, variants[state][variant]);

  return (
    <RadioIconWrapper isDisabled={isDisabled} isNegative={isNegative} isChecked={checked}>
      <Fade show={checked} styles={{ position: 'absolute', display: 'flex' }}>
        <CheckedIcon dotColor={dotColor} />
      </Fade>
    </RadioIconWrapper>
  );
};

export { RadioIcon };
