import type { CSSObject } from 'styled-components';
import type { DotNotationSpacingStringToken } from '~src/_helpers/types';

export type BoxProps = {
  display?: CSSObject['display'];
  flex?: CSSObject['flex'];
  flexWrap?: CSSObject['flexWrap'];
  flexDirection?: CSSObject['flexDirection'];
  flexGrow?: CSSObject['flexGrow'];
  alignItems?: CSSObject['alignItems'];
  justifyContent?: CSSObject['justifyContent'];
  alignSelf?: CSSObject['alignSelf'];
  paddingTop?: DotNotationSpacingStringToken | 'auto';
  paddingBottom?: DotNotationSpacingStringToken | 'auto';
  paddingLeft?: DotNotationSpacingStringToken | 'auto';
  paddingRight?: DotNotationSpacingStringToken | 'auto';
  marginTop?: DotNotationSpacingStringToken | 'auto' | number;
  marginBottom?: DotNotationSpacingStringToken | 'auto' | number;
  marginLeft?: DotNotationSpacingStringToken | 'auto' | number;
  marginRight?: DotNotationSpacingStringToken | 'auto' | number;
  gap?: DotNotationSpacingStringToken | 'auto';
  minHeight?: number;
  minWidth?: number;
  maxHeight?: number;
  maxWidth?: number;
  position?: CSSObject['position'];
  transform?: CSSObject['transform'];
  top?: CSSObject['top'];
  left?: CSSObject['left'];
  right?: CSSObject['right'];
  bottom?: CSSObject['bottom'];
};

export { default } from './Box.web';
