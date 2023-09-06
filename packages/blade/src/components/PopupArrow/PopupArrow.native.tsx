/* eslint-disable react/jsx-no-useless-fragment */
import * as React from 'react';
import styled from 'styled-components/native';
import { View } from 'react-native';
import type { CSSObject } from 'styled-components';
import type { Alignment, Placement, Side } from '@floating-ui/react';
import type { PopupArrowProps } from './types';
import Svg, { Path } from '~components/Icons/_Svg';
import { useTheme } from '~components/BladeProvider';
import type { SvgProps } from '~components/Icons/_Svg/Svg/types';
import { makeSize } from '~utils';
import { size } from '~tokens/global';
import { logger } from '~utils/logger';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const getPlacementParts = (placement: NonNullable<Placement>) => {
  const [side, alignment] = placement.split('-') as [Side, Alignment];
  return [side, alignment] as const;
};

const StyledSvg = styled(Svg)<{ styles?: CSSObject }>(({ styles }) => {
  return styles;
});

// modified version of FloatingArrow
// https://github.com/floating-ui/floating-ui/blob/master/packages/react/src/components/FloatingArrow.tsx
const PopupArrow = React.forwardRef<SvgProps, PopupArrowProps>(
  ({ context, width, height, fillColor, strokeColor }, ref): React.ReactElement => {
    const { theme } = useTheme();

    const {
      placement,
      elements: { floating },
      middlewareData: { arrow },
    } = context;
    const strokeWidth = theme.border.width.thin * 2;

    if (__DEV__) {
      if (!ref) {
        logger({
          type: 'warn',
          moduleName: 'PopupArrow',
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

    return (
      <View
        pointerEvents="none"
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
          <Path fill={fillColor} stroke="none" d={dValue} />
        </StyledSvg>
      </View>
    );
  },
);

export { PopupArrow };
