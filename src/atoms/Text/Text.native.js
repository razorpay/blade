import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { Text as NativeText } from 'react-native';
import baseTheme from '../../tokens/theme';
import { getColorKeys, getColor } from '../../_helpers/theme';
import automation from '../../_helpers/automation-attributes';
import { getLineHeightFromTextSize } from '../../_helpers/fonts';

const styles = {
  fontFamily({ theme, _weight }) {
    return theme.fonts.family.lato[_weight];
  },
  fontSize({ theme, size }) {
    return theme.fonts.size[size];
  },
  color({ theme, color }) {
    return getColor(theme, color);
  },
  textDecorationLine({ _isUnderlined }) {
    if (_isUnderlined) return 'underline';
    else {
      return 'none';
    }
  },
  alignSelf({ align }) {
    switch (align) {
      case 'left':
      default:
        return 'flex-start';
      case 'center':
        return 'center';
      case 'right':
        return 'flex-end';
    }
  },
  letterSpacing({ theme, _letterSpacing }) {
    return `${theme.fonts.letterSpacing[_letterSpacing]}`;
  },
  lineHeight({ theme, size, _lineHeight }) {
    if (_lineHeight) {
      return theme.fonts.lineHeight[_lineHeight];
    } else {
      return getLineHeightFromTextSize(size, theme);
    }
  },
};

const StyledText = styled(NativeText)`
  font-family: ${styles.fontFamily};
  font-size: ${styles.fontSize};
  color: ${styles.color};
  text-decoration-line: ${styles.textDecorationLine};
  align-self: ${styles.alignSelf};
  letter-spacing: ${styles.letterSpacing};
  line-height: ${styles.lineHeight};
`;

const Text = ({
  size,
  align,
  testID,
  color,
  children,
  numberOfLines,
  _weight,
  _isUnderlined,
  _letterSpacing,
  _lineHeight,
}) => {
  return (
    <StyledText
      size={size}
      align={align}
      color={color}
      numberOfLines={numberOfLines}
      _weight={_weight}
      _isUnderlined={_isUnderlined}
      _letterSpacing={_letterSpacing}
      _lineHeight={_lineHeight}
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
  align: PropTypes.oneOf(['left', 'center', 'right']),
  testID: PropTypes.string,
  numberOfLines: PropTypes.number,
  _weight: PropTypes.oneOf(Object.keys(baseTheme.fonts.weight)),
  _isUnderlined: PropTypes.bool,
  _letterSpacing: PropTypes.oneOf(Object.keys(baseTheme.fonts.letterSpacing)),
  _lineHeight: PropTypes.oneOf(Object.keys(baseTheme.fonts.lineHeight)),
};

Text.defaultProps = {
  size: 'large',
  align: 'left',
  color: 'shade.980',
  testID: 'ds-text',
  _weight: 'regular',
  _isUnderlined: false,
  _letterSpacing: 'small',
};

export default Text;
