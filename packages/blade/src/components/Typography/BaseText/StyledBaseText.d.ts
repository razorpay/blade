export { default } from './StyledBaseText.web';

export type StyledBaseTextProps = {
  color: string;
  fontFamily: string;
  fontSize: string;
  fontWeight: number;
  fontStyle?: 'italic' | 'normal';
  textDecorationLine?: 'line-through' | 'none';
  lineHeight: string;
  as?: 'code' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
  textAlign?: 'center' | 'justify' | 'left' | 'right';
  numberOfLines?: number;
};
