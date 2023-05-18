import isNumber from 'lodash/isNumber';
import styled from 'styled-components';
import type { SwitchProps } from './types';
import { useTheme } from '~components/BladeProvider';
import { getIn, makeMotionTime, makeSize, makeSpace, useBreakpoint } from '~utils';
import size from '~tokens/global/size';
import Svg, { Path } from '~components/Icons/_Svg';

const switchIconSize = {
  desktop: {
    small: size[6],
    medium: 'spacing.3',
  },
  mobile: {
    small: 'spacing.3',
    medium: size[10],
  },
} as const;

const AnimatedSvg = styled(Svg)<{ isChecked?: boolean }>(({ isChecked, theme }) => {
  return {
    transitionDuration: `${makeMotionTime(theme.motion.duration.xquick)}`,
    transitionTimingFunction: theme.motion.easing.standard.effective as string,
    transitionDelay: isChecked ? `${makeMotionTime(theme.motion.delay['2xshort'])}` : `0ms`,
    opacity: isChecked ? 1 : 0,
  };
});

const CheckIcon = ({
  isChecked,
  isDisabled,
  size = 'medium',
}: Pick<SwitchProps, 'isChecked' | 'isDisabled' | 'size'>): React.ReactElement => {
  const { theme } = useTheme();
  const { matchedDeviceType } = useBreakpoint({ breakpoints: theme.breakpoints });

  const width = switchIconSize[matchedDeviceType][size];
  const height = switchIconSize[matchedDeviceType][size];
  const finalWidth = isNumber(width) ? makeSize(width) : makeSpace(getIn(theme, width));
  const finalHeight = isNumber(height) ? makeSize(height) : makeSpace(getIn(theme, height));

  return (
    <AnimatedSvg
      isChecked={isChecked}
      width={finalWidth}
      height={finalHeight}
      viewBox="0 0 11 8"
      fill="none"
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.81891 0.546661C9.12722 0.238352 9.62709 0.238353 9.9354 0.546661C10.2437 0.85497 10.2437 1.35484 9.9354 1.66315L4.14592 7.45262C3.83761 7.76093 3.33775 7.76093 3.02944 7.45262L0.397858 4.82104C0.0895488 4.51273 0.0895488 4.01286 0.397857 3.70456C0.706166 3.39625 1.20603 3.39625 1.51434 3.70456L3.58768 5.77789L8.81891 0.546661Z"
        fill={
          isDisabled
            ? theme.colors.surface.text.placeholder.lowContrast
            : theme.colors.brand.gray[200].highContrast
        }
      />
    </AnimatedSvg>
  );
};

export { CheckIcon };
