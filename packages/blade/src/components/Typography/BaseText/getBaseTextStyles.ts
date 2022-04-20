import makeTypography from '../../../utils/makeTypography';
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
  font-size: ${makeTypography(theme.typography.fonts.size[fontSize])};
  font-weight: ${theme.typography.fonts.weight[fontWeight]};
  font-style: ${fontStyle};
  text-decoration-line: ${textDecorationLine};
  line-height: ${makeTypography(theme.typography.lineHeights[lineHeight])};
  ${textAlign ? `text-align: ${textAlign};` : ''}
`;

export default getBaseTextStyles;
