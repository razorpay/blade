/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react';
import { CheckboxIconWrapper } from './CheckboxIconWrapper';
import { Fade } from './Fade';
import getIn from '~utils/lodashButBetter/get';
import { useTheme } from '~components/BladeProvider';
import Svg, { Path } from '~components/Icons/_Svg';
import { makeSpace } from '~utils/makeSpace';
import { metaAttribute } from '~utils/metaAttribute';
import { size } from '~tokens/global';

const svgSize = {
  small: {
    width: size[8],
    height: size[8],
  },
  medium: {
    width: size[12],
    height: size[12],
  },
  large: {
    width: size[16],
    height: size[16],
  },
};

const CheckedIcon = ({ color, size }: { color: string; size: 'small' | 'medium' | 'large' }) => {
  const width = makeSpace(svgSize[size].width);
  const height = makeSpace(svgSize[size].height);

  return (
    <Svg width={width} height={height} viewBox="0 0 8 8" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.90237 1.76413C7.03254 1.89431 7.03254 2.10536 6.90237 2.23554L3.2357 5.90221C3.10553 6.03238 2.89447 6.03238 2.7643 5.90221L1.09763 4.23554C0.967456 4.10536 0.967456 3.89431 1.09763 3.76414C1.22781 3.63396 1.43886 3.63396 1.56904 3.76414L3 5.1951L6.43096 1.76413C6.56114 1.63396 6.77219 1.63396 6.90237 1.76413Z"
        fill={color}
        stroke={color}
        strokeWidth="0.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

const IndeterminateIcon = ({
  color,
  size,
}: {
  color: string;
  size: 'small' | 'medium' | 'large';
}) => {
  const width = makeSpace(svgSize[size].width);
  const height = makeSpace(svgSize[size].height);

  return (
    <Svg width={width} height={height} viewBox="0 0 8 8" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.3335 3.99984C1.3335 3.81574 1.48273 3.6665 1.66683 3.6665H6.3335C6.51759 3.6665 6.66683 3.81574 6.66683 3.99984C6.66683 4.18393 6.51759 4.33317 6.3335 4.33317H1.66683C1.48273 4.33317 1.3335 4.18393 1.3335 3.99984Z"
        fill={color}
        stroke={color}
        strokeWidth="0.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export type CheckboxIconProps = {
  isDisabled?: boolean;
  isNegative?: boolean;
  isChecked?: boolean;
  isIndeterminate?: boolean;
  size: 'small' | 'medium' | 'large';
};

const CheckboxIcon = ({
  isChecked,
  isIndeterminate,
  isDisabled,
  isNegative,
  size,
}: CheckboxIconProps) => {
  const { theme } = useTheme();
  const iconColor = getIn(theme, 'colors.interactive.icon.onPrimary.normal');
  return (
    <CheckboxIconWrapper
      size={size}
      isIndeterminate={isIndeterminate}
      isDisabled={isDisabled}
      isNegative={isNegative}
      isChecked={!!(isChecked || isIndeterminate)}
      {...metaAttribute({ name: 'checkbox-icon-wrapper' })}
    >
      <Fade show={isIndeterminate} styles={{ position: 'absolute', display: 'flex' }}>
        <IndeterminateIcon size={size} color={iconColor} />
      </Fade>
      <Fade
        show={Boolean(isChecked) && !isIndeterminate}
        styles={{ position: 'absolute', display: 'flex' }}
      >
        {isChecked ? <CheckedIcon size={size} color={iconColor} /> : null}
      </Fade>
    </CheckboxIconWrapper>
  );
};

export { CheckboxIcon };
