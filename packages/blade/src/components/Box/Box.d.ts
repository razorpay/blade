import type { CSSObject } from 'styled-components';
import type { DotNotationSpacingStringToken } from '~src/_helpers/types';

export type BoxProps = {
  display?: CSSObject['display'];
  flex?: CSSObject['flex'];
  flexWrap?: CSSObject['flexWrap'];
  flexDirection?: CSSObject['flexDirection'];
  alignItems?: CSSObject['alignItems'];
  justifyContent?: CSSObject['justifyContent'];
  alignSelf?: CSSObject['alignSelf'];
  overflow?: CSSObject['overflow'];
  position?: CSSObject['position'];
  top?: CSSObject['top'];
  right?: CSSObject['right'];
  bottom?: CSSObject['bottom'];
  left?: CSSObject['left'];
  paddingTop?: DotNotationSpacingStringToken | 'auto';
  paddingBottom?: DotNotationSpacingStringToken | 'auto';
  paddingLeft?: DotNotationSpacingStringToken | 'auto';
  paddingRight?: DotNotationSpacingStringToken | 'auto';
  marginTop?: DotNotationSpacingStringToken | 'auto';
  marginBottom?: DotNotationSpacingStringToken | 'auto';
  marginLeft?: DotNotationSpacingStringToken | 'auto';
  marginRight?: DotNotationSpacingStringToken | 'auto';
  gap?: DotNotationSpacingStringToken | 'auto' | number;
  minHeight?: number;
  minWidth?: number;
  maxHeight?: number;
  maxWidth?: number;
};

export { default } from './Box.web';
