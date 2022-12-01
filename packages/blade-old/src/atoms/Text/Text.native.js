import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { Text as NativeText } from 'react-native';
import baseTheme from '../../tokens/theme';
import { getColorKeys, getColor, getLineHeight } from '../../_helpers/theme';
import automation from '../../_helpers/automation-attributes';

const styles = {
  fontFamily({ theme, weight }) {
    return theme.bladeOld.fonts.family.lato[weight];
  },
  fontSize({ theme, size }) {
    return theme.bladeOld.fonts.size[size];
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
    return `${theme.bladeOld.fonts.letterSpacing[_letterSpacing]}`;
  },
  lineHeight({ theme, size, _lineHeight }) {
    if (_lineHeight) {
      return theme.bladeOld.fonts.lineHeight[_lineHeight];
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
  weight,
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
      weight={weight}
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
  size: PropTypes.oneOf(Object.keys(baseTheme.bladeOld.fonts.size)),
  color: PropTypes.oneOf(getColorKeys()),
  align: PropTypes.oneOf(['left', 'right', 'center', 'justify', 'inherit', 'initial']),
  testID: PropTypes.string,
  maxLines: PropTypes.number,
  weight: PropTypes.oneOf(Object.keys(baseTheme.bladeOld.fonts.weight)),
  _isUnderlined: PropTypes.bool,
  _letterSpacing: PropTypes.oneOf(Object.keys(baseTheme.bladeOld.fonts.letterSpacing)),
  _lineHeight: PropTypes.oneOf(Object.keys(baseTheme.bladeOld.fonts.lineHeight)),
};

Text.defaultProps = {
  size: 'large',
  color: 'shade.980',
  align: 'left',
  testID: 'ds-text',
  weight: 'regular',
  _isUnderlined: false,
  _letterSpacing: 'small',
};

export default Text;
