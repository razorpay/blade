import type { ReactElement } from 'react';
import { Svg as SvgNative } from 'react-native-svg';
import mapA11yProps from '../../../../utils/mapProps';
import type { SvgProps } from './Svg.d';

const Svg = ({ children, height, viewBox, width, fill }: SvgProps): ReactElement => {
  return (
    <SvgNative
      {...mapA11yProps({ accessibilityHidden: true })}
      height={height}
      viewBox={viewBox}
      width={width}
      fill={fill}
    >
      {children}
    </SvgNative>
  );
};

export default Svg;
