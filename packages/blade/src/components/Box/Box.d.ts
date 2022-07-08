import type { CSSObject } from 'styled-components';
import type { DotNotationSpacingStringToken } from '../../_helpers/types';

export type BoxProps = {
  display?: CSSObject['display'];
  flex?: CSSObject['flex'];
  flexDirection?: CSSObject['flexDirection'];
  alignItems?: CSSObject['alignItems'];
  justifyContent?: CSSObject['justifyContent'];
  alignSelf?: CSSObject['alignSelf'];
  paddingTop?: DotNotationSpacingStringToken;
  paddingBottom?: DotNotationSpacingStringToken;
  paddingLeft?: DotNotationSpacingStringToken;
  paddingRight?: DotNotationSpacingStringToken;
  width?: number | 'fit-content' | 'auto';
  minHeight?: number;
  minWidth?: number;
  maxHeight?: number;
  maxWidth?: number;
};

export { default } from './Box.web';
