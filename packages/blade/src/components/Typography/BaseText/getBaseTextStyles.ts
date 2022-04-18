import type { BaseTextProps } from './BaseText.d';

const getBaseTextStyles = ({
  theme,
  color,
  fontFamily,
  fontSize,
  fontWeight,
  fontStyle,
  textDecorationLine,
  lineHeight,
  textAlign,
}: BaseTextProps): string => `
  color: ${color};
  font-family: ${theme.typography.fonts.family[fontFamily]};
  font-size: ${theme.typography.fonts.size[fontSize]}px;
  font-weight: ${theme.typography.fonts.weight[fontWeight]};
  font-style: ${fontStyle};
  text-decoration-line: ${textDecorationLine};
  line-height: ${theme.typography.lineHeights[lineHeight]}px;
  ${textAlign ? `text-align: ${textAlign};` : ''}
`;

export default getBaseTextStyles;
