/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import getIn from 'lodash/get';
import React from 'react';
import { radioIconColors, radioSizes } from '../radioTokens';
import type { RadioProps } from '../Radio';
import { RadioIconWrapper } from './RadioIconWrapper';
import { Fade } from './Fade';
import { useTheme } from '~components/BladeProvider';
import Svg from '~components/Icons/_Svg';
import Circle from '~components/Icons/_Svg/Circle';
import { makeSpace } from '~utils/makeSpace';
import { metaAttribute } from '~utils/metaAttribute';

export type RadioIconProps = {
  isDisabled?: boolean;
  isNegative?: boolean;
  isChecked?: boolean;
} & Required<Pick<RadioProps, 'size'>>;

const CheckedIcon = ({ color, size }: { color: string; size: RadioIconProps['size'] }) => {
  const width = radioSizes.icon[size].width;
  const height = radioSizes.icon[size].height;
  const radius = radioSizes.icon[size].dotRadius;
  const viewBox = `0 0 ${width} ${height}`;
  const cx = `${width / 2}`;
  const cy = `${height / 2}`;

  return (
    <Svg width={makeSpace(width)} height={makeSpace(height)} viewBox={viewBox} fill="none">
      <Circle cx={cx} cy={cy} r={`${radius}`} fill={color} />
    </Svg>
  );
};

const RadioIcon = ({ isChecked, isDisabled, isNegative, size }: RadioIconProps) => {
  const { theme } = useTheme();

  const checked = Boolean(isChecked);
  const state = checked ? 'checked' : 'unchecked';
  let variant: 'default' | 'disabled' | 'negative' = 'default';
  if (isDisabled) variant = 'disabled';
  if (isNegative) variant = 'negative';
  const dotColor = getIn(theme, radioIconColors.variants[variant].dot[state]);

  return (
    <RadioIconWrapper
      size={size}
      isDisabled={isDisabled}
      isNegative={isNegative}
      isChecked={checked}
      {...metaAttribute({ name: 'radio-icon-wrapper' })}
    >
      <Fade show={checked} styles={{ position: 'absolute', display: 'flex' }}>
        <CheckedIcon size={size} color={dotColor} />
      </Fade>
    </RadioIconWrapper>
  );
};

export { RadioIcon };
