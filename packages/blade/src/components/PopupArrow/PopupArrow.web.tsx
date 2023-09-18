import React from 'react';
import { FloatingArrow } from '@floating-ui/react';
import type { PopupArrowProps } from './types';
import { useTheme } from '~utils';

const PopupArrow = React.forwardRef<SVGSVGElement, PopupArrowProps>(
  ({ context, width, height, fillColor, strokeColor }, arrowRef) => {
    const { theme } = useTheme();
    return (
      <FloatingArrow
        ref={arrowRef}
        context={context}
        width={width}
        height={height}
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth={theme.border.width.thin}
      />
    );
  },
);

export { PopupArrow };
