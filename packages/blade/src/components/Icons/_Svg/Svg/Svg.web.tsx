import React from 'react';
import type { ReactElement } from 'react';
import type { SvgProps } from './Svg.d';

const Svg = ({ children, height, viewBox, width, fill, xmlns }: SvgProps): ReactElement => {
  return <svg {...{ children, height, viewBox, width, fill, xmlns }} />;
};

export default Svg;
