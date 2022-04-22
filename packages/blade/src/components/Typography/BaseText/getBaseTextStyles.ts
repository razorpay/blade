import type { StyledBaseTextProps } from './StyledBaseText.d';

const getBaseTextStyles = ({
  color,
  fontFamily,
  fontSize,
  fontWeight,
  fontStyle = 'normal',
  textDecorationLine = 'none',
  lineHeight,
  textAlign,
}: StyledBaseTextProps): string => `
  color: ${color};
  font-family: ${fontFamily};
  font-size: ${fontSize};
  font-weight: ${fontWeight};
  font-style: ${fontStyle};
  text-decoration-line: ${textDecorationLine};
  line-height: ${lineHeight};
  ${textAlign ? `text-align: ${textAlign};` : ''}
`;

export default getBaseTextStyles;
