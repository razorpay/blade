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
         * own width/height. At `2xsmall` (2) a 22x12 arrow is blunted by only 1.5px, which
         * disappears into antialiasing at 1x and reads as a hard point next to the popup's
         * rounded corners. `xsmall` (4) is the largest value that still leaves straight edges —
         * the shape degenerates into a lens by 8.
         */
        tipRadius={theme.border.radius.xsmall}
        style={{ ...style }}
      />
    );
  },
);

export { PopupArrow };
