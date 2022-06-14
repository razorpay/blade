import type { ReactElement } from 'react';
import mapA11yProps from '../../../../utils/mapProps';
import type { SvgProps } from './Svg.d';

const Svg = ({ children, height, viewBox, width, fill }: SvgProps): ReactElement => {
  return (
    <svg
      {...mapA11yProps({ accessibilityHidden: true })}
      height={height}
      viewBox={viewBox}
      width={width}
      fill={fill}
    >
      {children}
    </svg>
  );
};

export default Svg;
