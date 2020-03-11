import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import baseTheme from '../../tokens/theme';
import { getColorKeys, getColor, getLineHeight } from '../../_helpers/theme';

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
    if (_isUnderlined) {
      return 'underline';
    } else {
      return 'none';
    }
  },
  align({ align }) {
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
      return getLineHeight(theme, size);
    }
  },
  overflow({ truncate }) {
    if (truncate) {
      return 'hidden';
    } else {
      return '';
    }
  },
  whiteSpace({ truncate }) {
    if (truncate) {
      return 'nowrap';
    } else {
      return '';
    }
  },
  textOverflow({ truncate }) {
    if (truncate) {
      return 'ellipsis';
    } else {
      return '';
    }
  },
};

const Text = styled(
  ({
    as,
    fontFamily,
    fontSize,
    children,
    textDecorationLine,
    align,
    letterSpacing,
    lineHeight,
    ...props
  }) => React.createElement(as, props, children),
)`
  font-family: ${styles.fontFamily};
  font-size: ${styles.fontSize};
  color: ${styles.color};
  text-decoration-line: ${styles.textDecorationLine};
  align-self: ${styles.align};
  letter-spacing: ${styles.letterSpacing};
  line-height: ${styles.lineHeight};
  overflow: ${styles.overflow};
  white-space: ${styles.whiteSpace};
  text-overflow: ${styles.textOverflow};
`;

Text.propTypes = {
  as: PropTypes.string,
  size: PropTypes.oneOf(['xxsmall', 'xsmall', 'small', 'medium', 'large']),
  color: PropTypes.oneOf(getColorKeys()),
  align: PropTypes.oneOf(['left', 'center', 'right']),
  'data-testid': PropTypes.string,
  _weight: PropTypes.oneOf(Object.keys(baseTheme.fonts.weight)),
  _isUnderlined: PropTypes.bool,
  _letterSpacing: PropTypes.oneOf(Object.keys(baseTheme.fonts.letterSpacing)),
  _lineHeight: PropTypes.oneOf(Object.keys(baseTheme.fonts.lineHeight)),
  truncate: PropTypes.bool,
};

Text.defaultProps = {
  as: 'div',
  size: 'large',
  align: 'left',
  color: 'shade.980',
  'data-testid': 'ds-text',
  _weight: 'regular',
  _isUnderlined: false,
  _letterSpacing: 'small',
};

export default Text;
