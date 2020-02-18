import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import theme from '../../tokens/theme';
import { Text as NativeText } from 'react-native';
import { getColorKeys, getColor } from '../../utils/colors';
import automation from '../../_helpers/automation-attributes';
import fonts from '../../tokens/fonts';

const StyledText = styled(NativeText)(
  (props) => `
  font-family: ${fonts.families[props.weight]};
  font-size: ${props.theme.fonts.size[props.size]};
  color: ${getColor(props.theme, props.color) || props.theme.colors.shade[800]};
  text-decoration-line: ${props.isUnderlined ? 'underline' : 'none'};
  align-self: ${props.align};
`,
);

const Text = ({ weight, size, isUnderlined, align, testID, color, children }) => {
  return (
    <StyledText
      weight={weight}
      size={size}
      isUnderline={isUnderlined}
      align={align}
      color={color}
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
  color: PropTypes.oneOf(getColorKeys()),
  isUnderlined: PropTypes.bool,
  align: PropTypes.oneOf(['flex-start', 'center', 'flex-end']),
  testID: PropTypes.string,
};

Text.defaultProps = {
  weight: 'regular',
  size: 'small',
  isUnderlined: false,
  align: 'flex-start',
  testID: 'ds-text',
};
export default Text;
