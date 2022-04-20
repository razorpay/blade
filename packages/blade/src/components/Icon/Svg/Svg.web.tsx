import React from 'react';
import type { ReactElement } from 'react';
import type { SvgProps } from './Svg.d';

const Svg = (props: SvgProps): ReactElement => {
  return <svg {...props} />;
};

export default Svg;
