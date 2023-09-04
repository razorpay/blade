/* eslint-disable react/jsx-no-useless-fragment */
import * as React from 'react';
import styled from 'styled-components/native';
import type { UseFloatingReturn } from '@floating-ui/react-native';
import { View } from 'react-native';
import type { CSSObject } from 'styled-components';
import { ARROW_HEIGHT, ARROW_WIDTH } from './constants';
import { getPlacementParts } from './utils';
import Svg, { Path } from '~components/Icons/_Svg';
import { useTheme } from '~components/BladeProvider';
import type { SvgProps } from '~components/Icons/_Svg/Svg/types';
import { makeSize } from '~utils';
import { size } from '~tokens/global';
import { logger } from '~utils/logger';

type PopoverArrowProps = {
  context: UseFloatingReturn;
};

const StyledSvg = styled(Svg)<{ styles?: CSSObject }>(({ styles }) => {
  return styles;
});

// modified version of FloatingArrow
// https://github.com/floating-ui/floating-ui/blob/master/packages/react/src/components/FloatingArrow.tsx
const PopoverArrow = React.forwardRef<SvgProps, PopoverArrowProps>(
  ({ context }, ref): React.ReactElement => {
    const { theme } = useTheme();

    const {
      placement,
      elements: { floating },
      middlewareData: { arrow },
    } = context;
    const width = ARROW_WIDTH;
    const height = ARROW_HEIGHT;
    const strokeWidth = theme.border.width.thin * 2;

    if (__DEV__) {
      if (!ref) {
        logger({
          type: 'warn',
          moduleName: 'PopoverArrow',
          message: 'Floating UI: The `ref` prop is required for the `FloatingArrow` component.',
        });
      }
    }

    if (!floating) {
      return <></>;
    }

    const [side] = getPlacementParts(placement);

    const svgX = width / 2;
    const svgY = 0;
    const dValue =
      'M0,0' +
      ` H${width}` +
      ` L${width - svgX},${height - svgY}` +
      ` Q${width / 2},${height} ${svgX},${height - svgY}` +
      ' Z';

    const staticSide = {
      top: 'bottom',
      right: 'left',
      bottom: 'top',
      left: 'right',
    }[side];

    const rotation = {
      top: 0,
      bottom: 180,
      left: -90,
      right: 90,
    }[side];

    let newStyles = {};
    if (arrow) {
      const { x, y } = arrow;
      newStyles = {
        width: makeSize(size[20]),
        height: makeSize(size[20]),
        position: 'absolute',
        left: x != null ? `${x}px` : undefined,
        top: y != null ? `${y}px` : undefined,
        // Ensure the static side gets unset when
        // flipping to other placements' axes.
        right: undefined,
        bottom: undefined,
        [staticSide]: `${-width}px`,
        transform: `rotate(${rotation}deg)`,
      };
    }

    const strokeColor = theme.colors.brand.gray[300].highContrast;
    return (
      <View
        collapsable={false}
        style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
      >
        <StyledSvg
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment, @typescript-eslint/prefer-ts-expect-error
          // @ts-ignore this file is native only
          ref={ref}
          width={`${width}px`}
          height={`${width}px`}
          viewBox={`0 0 ${width} ${width}`}
          styles={newStyles}
        >
          <Path fill="none" stroke={strokeColor} strokeWidth={`${strokeWidth}px`} d={dValue} />
          <Path fill={theme.colors.brand.gray[200].highContrast} stroke="none" d={dValue} />
        </StyledSvg>
      </View>
    );
  },
);

export { PopoverArrow };
