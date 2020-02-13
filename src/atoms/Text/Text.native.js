import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import theme from '../../tokens/theme';
import { Text as NativeText } from 'react-native';
import { flattenArray } from '../../utils/index';

const fontFamilies = {
  light: `Lato-Regular`,
  regular: `Lato-Regular`,
  bold: `Lato-Bold`,
};

const Text = styled(NativeText)(
  (props) => `
  font-family: ${fontFamilies[props.weight]};
  font-size: ${props.theme.fonts.size[props.size]};
  letter-spacing: ${props.theme.fonts.letterSpacing[props.letterSpacing]};
  color: ${props.color || props.theme.colors.shade[800]};
  text-decoration-line: ${props.underline ? 'underline' : 'none'};
  align-self: ${props.align};
`,
);

Text.propTypes = {
  children: PropTypes.node.isRequired,
  weight: PropTypes.oneOf(Object.keys(theme.fonts.weight)),
  size: PropTypes.oneOf(Object.keys(theme.fonts.size)),
  letterSpacing: PropTypes.oneOf(Object.keys(theme.fonts.letterSpacing)),
  color: PropTypes.oneOf(flattenArray(Object.values(theme.colors).map(Object.values))),
  underline: PropTypes.bool,
  align: PropTypes.oneOf(['flex-start', 'center', 'flex-end']),
};

Text.defaultProps = {
  weight: 'regular',
  size: 'm',
  letterSpacing: 's',
  underline: false,
  align: 'flex-start',
  testID: 'ds-text',
};

export default Text;
