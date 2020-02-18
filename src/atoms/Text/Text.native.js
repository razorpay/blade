import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import styled, { ThemeContext } from 'styled-components/native';
import theme from '../../tokens/theme';
import { Text as NativeText } from 'react-native';
import { getAllColorNames, resolveColorFromString } from '../../utils/colors';
import automation from '../../_helpers/automation-attributes';

const fontFamilies = {
  light: `Lato-Regular`,
  regular: `Lato-Regular`,
  bold: `Lato-Bold`,
};

const StyledText = styled(NativeText)(
  (props) => `
  font-family: ${fontFamilies[props.weight]};
  font-size: ${props.theme.fonts.size[props.size]};
  color: ${props.color || props.theme.colors.shade[800]};
  text-decoration-line: ${props.underline ? 'underline' : 'none'};
  align-self: ${props.align};
`,
);

const Text = ({ weight, size, underline, align, testID, color, children }) => {
  const currentTheme = useContext(ThemeContext);
  return (
    <StyledText
      weight={weight}
      size={size}
      underline={underline}
      align={align}
      color={resolveColorFromString(currentTheme, color)}
      {...automation(testID)}
    >
      {children}
    </StyledText>
  );
};

Text.propTypes = {
  children: PropTypes.string,
  weight: PropTypes.oneOf(Object.keys(theme.fonts.weight)),
  size: PropTypes.oneOf(['xxsmall', 'xsmall', 'small', 'medium', 'large']),
  color: PropTypes.oneOf(getAllColorNames()),
  underline: PropTypes.bool,
  align: PropTypes.oneOf(['flex-start', 'center', 'flex-end']),
  testID: PropTypes.string,
};

Text.defaultProps = {
  weight: 'regular',
  size: 'small',
  underline: false,
  align: 'flex-start',
  testID: 'ds-text',
};
export default Text;
