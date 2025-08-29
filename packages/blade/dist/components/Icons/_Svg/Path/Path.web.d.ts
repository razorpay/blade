import { ReactElement } from 'react';
import { Exact, PathProps } from './types';
declare const Path: <Props extends Exact<PathProps, Props>>({ d, clipPath, clipRule, fill, fillOpacity, fillRule, stroke, strokeLinecap, strokeLinejoin, strokeWidth, }: Props) => ReactElement;
export default Path;
