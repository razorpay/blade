/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react';
import { CheckboxIconWrapper } from './CheckboxIconWrapper';
import { Fade } from './Fade';
import { useTheme } from '~components/BladeProvider';
import Svg, { Path } from '~components/Icons/_Svg';
import { getIn } from '~utils';

const CheckedIconSmall = ({ color }: { color: string }) => {
  return (
    <Svg width="8" height="8" viewBox="0 0 8 8" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.90237 1.76413C7.03254 1.89431 7.03254 2.10536 6.90237 2.23554L3.2357 5.90221C3.10553 6.03238 2.89447 6.03238 2.7643 5.90221L1.09763 4.23554C0.967456 4.10536 0.967456 3.89431 1.09763 3.76414C1.22781 3.63396 1.43886 3.63396 1.56904 3.76414L3 5.1951L6.43096 1.76413C6.56114 1.63396 6.77219 1.63396 6.90237 1.76413Z"
        fill={color}
        stroke="white"
        strokeWidth="0.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

const CheckedIconMedium = ({ color }: { color: string }) => {
  return (
    <Svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.3536 2.64645C10.5488 2.84171 10.5488 3.15829 10.3536 3.35355L4.85355 8.85355C4.65829 9.04882 4.34171 9.04882 4.14645 8.85355L1.64645 6.35355C1.45118 6.15829 1.45118 5.84171 1.64645 5.64645C1.84171 5.45118 2.15829 5.45118 2.35355 5.64645L4.5 7.79289L9.64645 2.64645C9.84171 2.45118 10.1583 2.45118 10.3536 2.64645Z"
        fill={color}
        stroke="white"
        strokeWidth="0.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

const CheckedIcon = ({ color, size }: { color: string; size: 'small' | 'medium' }) => {
  const icons = {
    small: CheckedIconSmall,
    medium: CheckedIconMedium,
  };

  const Icon = icons[size];
  return <Icon color={color} />;
};

const IndeterminateIcon = ({ color, size }: { color: string; size: 'small' | 'medium' }) => {
  const path = {
    medium:
      'M2 6C2 5.72386 2.22386 5.5 2.5 5.5H9.5C9.77614 5.5 10 5.72386 10 6C10 6.27614 9.77614 6.5 9.5 6.5H2.5C2.22386 6.5 2 6.27614 2 6Z',
    small:
      'M1.3335 3.99984C1.3335 3.81574 1.48273 3.6665 1.66683 3.6665H6.3335C6.51759 3.6665 6.66683 3.81574 6.66683 3.99984C6.66683 4.18393 6.51759 4.33317 6.3335 4.33317H1.66683C1.48273 4.33317 1.3335 4.18393 1.3335 3.99984Z',
  };
  const dims = {
    small: {
      width: 8,
      height: 8,
      viewBox: '0 0 8 8',
    },
    medium: {
      width: 12,
      height: 12,
      viewBox: '0 0 12 12',
    },
  };

  const width = `${dims[size].width}px`;
  const height = `${dims[size].height}px`;
  const viewBox = dims[size].viewBox;
  const d = path[size];

  return (
    <Svg width={width} height={height} viewBox={viewBox} fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d={d}
        fill={color}
        stroke="white"
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
  size: 'small' | 'medium';
};

const CheckboxIcon = ({
  isChecked,
  isIndeterminate,
  isDisabled,
  isNegative,
  size,
}: CheckboxIconProps) => {
  const { theme } = useTheme();
  const defaultIconColor = getIn(theme, 'colors.brand.gray.200');
  const disabledIconColor = getIn(theme, 'colors.brand.gray.500');
  const iconColor = isDisabled ? disabledIconColor : defaultIconColor;

  return (
    <CheckboxIconWrapper
      size={size}
      isIndeterminate={isIndeterminate}
      isDisabled={isDisabled}
      isNegative={isNegative}
      isChecked={!!(isChecked || isIndeterminate)}
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
