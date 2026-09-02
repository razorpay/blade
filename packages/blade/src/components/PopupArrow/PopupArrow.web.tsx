import React from 'react';
import { FloatingArrow } from '@floating-ui/react';
import type { PopupArrowProps } from './types';
import { useTheme } from '~components/BladeProvider';

const PopupArrow = React.forwardRef<SVGSVGElement, PopupArrowProps>(
  ({ context, width, height, fillColor, strokeColor, strokeWidth, style }, arrowRef) => {
    const { theme } = useTheme();
    return (
      <FloatingArrow
        ref={arrowRef}
        context={context}
        width={width}
        height={height}
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth={strokeWidth ?? 0}
        /**
         * `tipRadius` is a ratio, not a px value — FloatingArrow scales it against the arrow's
         * own width/height, so the rounding grows much faster than the token number suggests.
         * `xsmall` (4) visibly bows the arrow's edges; `2xsmall` (2) softens the tip while
         * keeping the sides straight.
         */
        tipRadius={theme.border.radius['2xsmall']}
        style={{ ...style }}
      />
    );
  },
);

export { PopupArrow };
