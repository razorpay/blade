/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react';
import getIn from '../../../utils/getIn';
import makeMotionTime from '../../../utils/makeMotionTime';
import { useTheme } from '../../BladeProvider';
import { Svg, Path } from '../../Icons/_Svg';
import { CheckboxIconWrapper } from './CheckboxIconWrapper';
import { Fade } from './Fade';

const CheckedIcon = ({ color, hidden }: { color: string; hidden?: boolean }) => {
  return (
    <Svg width="16px" height="16px" viewBox="0 0 16 16" fill="none">
      {hidden ? null : (
        <Path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M12.3536 4.64645C12.5488 4.84171 12.5488 5.15829 12.3536 5.35355L6.85355 10.8536C6.65829 11.0488 6.34171 11.0488 6.14645 10.8536L3.64645 8.35355C3.45118 8.15829 3.45118 7.84171 3.64645 7.64645C3.84171 7.45118 4.15829 7.45118 4.35355 7.64645L6.5 9.79289L11.6464 4.64645C11.8417 4.45118 12.1583 4.45118 12.3536 4.64645Z"
          fill={color}
        />
      )}
    </Svg>
  );
};

const IndeterminateIcon = ({ color }: { color: string }) => {
  return (
    <Svg width="16px" height="16px" viewBox="0 0 16 16" fill="none">
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M4 8C4 7.72386 4.22386 7.5 4.5 7.5H11.5C11.7761 7.5 12 7.72386 12 8C12 8.27614 11.7761 8.5 11.5 8.5H4.5C4.22386 8.5 4 8.27614 4 8Z"
        fill={color}
      />
    </Svg>
  );
};

export type CheckboxIconProps = {
  isFocused?: boolean;
  isDisabled?: boolean;
  isNegative?: boolean;
  isChecked?: boolean;
  isIndeterminate?: boolean;
};

const CheckboxIcon = ({
  isChecked,
  isIndeterminate,
  isDisabled,
  isNegative,
  isFocused,
}: CheckboxIconProps) => {
  const { theme } = useTheme();
  const defaultIconColor = getIn(theme, 'colors.brand.gray.200');
  const disabledIconColor = getIn(theme, 'colors.brand.gray.500');
  const iconColor = isDisabled ? disabledIconColor : defaultIconColor;

  const fadeIn = `fadeIn ${makeMotionTime(theme.motion.duration.xquick)} ${
    theme.motion.easing.entrance.effective as string
  }`;

  const fadeOut = `fadeOut ${makeMotionTime(theme.motion.duration.xquick)} ${
    theme.motion.easing.exit.effective as string
  }`;

  return (
    <CheckboxIconWrapper
      isIndeterminate={isIndeterminate}
      isFocused={isFocused}
      isDisabled={isDisabled}
      isNegative={isNegative}
      isChecked={!!(isChecked || isIndeterminate)}
    >
      <Fade
        enter={fadeIn}
        leave={fadeOut}
        show={!!isIndeterminate}
        styles={{ position: 'absolute', display: 'flex' }}
      >
        <IndeterminateIcon color={iconColor} />
      </Fade>
      <Fade
        enter={fadeIn}
        leave={fadeOut}
        show={!!isChecked && !isIndeterminate}
        styles={{ position: 'absolute', display: 'flex' }}
      >
        <CheckedIcon hidden={!isChecked} color={iconColor} />
      </Fade>
    </CheckboxIconWrapper>
  );
};

export { CheckboxIcon };
