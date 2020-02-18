import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import baseTheme from '../../tokens/theme';
import { Text as NativeText } from 'react-native';
import { getColorKeys, getColor } from '../../utils/colors';
import automation from '../../_helpers/automation-attributes';

const styles = {
  fontFamily({ theme, weight }) {
    return theme.fonts.family[weight];
  },
  fontSize({ theme, size }) {
    return theme.fonts.size[size];
  },
  color({ theme, color }) {
    if (color) {
      return getColor(theme, color);
    }
    return theme.colors.shade[800];
  },
  textDecorationLine({ isUnderlined }) {
    if (isUnderlined) return 'underline';
    else return 'none';
  },
  alignSelf({ align }) {
    return align;
  },
};

const StyledText = styled(NativeText)`
  font-family: ${styles.fontFamily};
  font-size: ${styles.fontSize};
  color: ${styles.color};
  text-decoration-line: ${styles.textDecorationLine};
  align-self: ${styles.alignSelf};
`;

const Text = ({ weight, size, isUnderlined, align, testID, color, children }) => {
  return (
    <StyledText
      weight={weight}
      size={size}
      isUnderlined={isUnderlined}
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
  weight: PropTypes.oneOf(Object.keys(baseTheme.fonts.weight)),
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
