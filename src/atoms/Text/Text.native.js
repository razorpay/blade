import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import baseTheme from '../../tokens/theme';
import { Text as NativeText } from 'react-native';
import { getColorKeys, getColor } from '../../utils/colors';
import automation from '../../_helpers/automation-attributes';

const styles = {
  fontFamily({ theme, _weight }) {
    return theme.fonts.family[_weight];
  },
  fontSize({ theme, size }) {
    return theme.fonts.size[size];
  },
  color({ theme, color }) {
    if (color) {
      return getColor(theme, color);
    } else return theme.colors.shade[800];
  },
  textDecorationLine({ _isUnderlined }) {
    if (_isUnderlined) return 'underline';
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

const Text = ({ size, align, testID, color, children, _weight, _isUnderlined }) => {
  return (
    <StyledText
      size={size}
      align={align}
      color={color}
      _weight={_weight}
      _isUnderlined={_isUnderlined}
      {...automation(testID)}
    >
      {children}
    </StyledText>
  );
};

Text.propTypes = {
  children: PropTypes.string,
  size: PropTypes.oneOf(['xxsmall', 'xsmall', 'small', 'medium', 'large']),
  color: PropTypes.oneOf(getColorKeys()),
  align: PropTypes.oneOf(['flex-start', 'center', 'flex-end']),
  testID: PropTypes.string,
  _weight: PropTypes.oneOf(Object.keys(baseTheme.fonts.weight)),
  _isUnderlined: PropTypes.bool,
};

Text.defaultProps = {
  size: 'small',
  align: 'flex-start',
  testID: 'ds-text',
  _weight: 'regular',
  _isUnderlined: false,
};
export default Text;
