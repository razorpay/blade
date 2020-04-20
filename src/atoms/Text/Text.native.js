import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { Text as NativeText } from 'react-native';
import baseTheme from '../../tokens/theme';
import { getColorKeys, getColor, getLineHeight } from '../../_helpers/theme';
import automation from '../../_helpers/automation-attributes';

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
  letterSpacing({ theme, _letterSpacing }) {
    return `${theme.fonts.letterSpacing[_letterSpacing]}`;
  },
  lineHeight({ theme, size, _lineHeight }) {
    if (_lineHeight) {
      return theme.fonts.lineHeight[_lineHeight];
    } else {
      return getLineHeight(theme, size);
    }
  },
  textAlign({ align }) {
    if (align === 'inherit' || align === 'initial') {
      return 'auto';
    }
    return align;
  },
};

const StyledText = styled(NativeText)`
  font-family: ${styles.fontFamily};
  font-size: ${styles.fontSize};
  color: ${styles.color};
  text-decoration-line: ${styles.textDecorationLine};
  letter-spacing: ${styles.letterSpacing};
  line-height: ${styles.lineHeight};
  text-align: ${styles.textAlign};
`;

const Text = ({
  size,
  testID,
  color,
  align,
  children,
  maxLines,
  _weight,
  _isUnderlined,
  _letterSpacing,
  _lineHeight,
}) => {
  return (
    <StyledText
      size={size}
      color={color}
      align={align}
      numberOfLines={maxLines}
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
  align: PropTypes.oneOf(['left', 'right', 'center', 'justify', 'inherit', 'initial']),
  testID: PropTypes.string,
  maxLines: PropTypes.number,
  _weight: PropTypes.oneOf(Object.keys(baseTheme.fonts.weight)),
  _isUnderlined: PropTypes.bool,
  _letterSpacing: PropTypes.oneOf(Object.keys(baseTheme.fonts.letterSpacing)),
  _lineHeight: PropTypes.oneOf(Object.keys(baseTheme.fonts.lineHeight)),
};

Text.defaultProps = {
  size: 'large',
  color: 'shade.980',
  align: 'left',
  testID: 'ds-text',
  _weight: 'regular',
  _isUnderlined: false,
  _letterSpacing: 'small',
};

export default Text;
