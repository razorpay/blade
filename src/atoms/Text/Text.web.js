import PropTypes from 'prop-types';
import styled from 'styled-components';
import baseTheme from '../../tokens/theme';
import { getColorKeys, getColor, getLineHeight } from '../../_helpers/theme';

/*
 * Sets height for the div
 * @param {Object} theme
 * @param {String} _lineHeight
 * @param {number} maxLines
 */
const calculateHeight = ({ theme, _lineHeight, maxLines }) => {
  const lineHeight = `${parseFloat(theme.fonts.lineHeight[_lineHeight])}`;
  const containerHeight = `${lineHeight * maxLines}px`;

  return containerHeight;
};

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
  maxHeight({ theme, _lineHeight, maxLines }) {
    if (maxLines) {
      const maxHeight = calculateHeight({ theme, _lineHeight, maxLines });
      return maxHeight;
    } else {
      return 'initial';
    }
  },
  whiteSpace({ maxLines }) {
    if (maxLines) {
      return 'initial';
    } else {
      return 'nowrap';
    }
  },
  overflow({ maxLines }) {
    if (maxLines) {
      return 'hidden';
    } else {
      return 'initial';
    }
  },
  textOverflow({ maxLines }) {
    if (maxLines) {
      return 'ellipsis';
    } else {
      return 'initial';
    }
  },
  textDecoration({ _isUnderlined }) {
    if (_isUnderlined) {
      return 'undefined';
    } else {
      return 'none';
    }
  },
  ellipses({ maxLines }) {
    if (maxLines) {
      return "'...'";
    } else {
      return '';
    }
  },
};

const Text = styled.div`
  font-family: ${styles.fontFamily};
  font-size: ${styles.fontSize};
  color: ${styles.color};
  text-decoration-line: ${styles.textDecoration};
  align-self: ${styles.align};
  letter-spacing: ${styles.letterSpacing};
  line-height: ${styles.lineHeight};
  overflow: ${styles.overflow};
  white-space: ${styles.whiteSpace};
  text-overflow: ${styles.textOverflow};
  max-height: ${styles.maxHeight};
  position: relative;
  &&:after {
    content: ${styles.ellipses};
    position: absolute;
    bottom: 0;
    right: 0;
  }
`;

Text.propTypes = {
  size: PropTypes.oneOf(['xxsmall', 'xsmall', 'small', 'medium', 'large']),
  color: PropTypes.oneOf(getColorKeys()),
  align: PropTypes.oneOf(['left', 'center', 'right']),
  'data-testid': PropTypes.string,
  _weight: PropTypes.oneOf(Object.keys(baseTheme.fonts.weight)),
  _isUnderlined: PropTypes.bool,
  _letterSpacing: PropTypes.oneOf(Object.keys(baseTheme.fonts.letterSpacing)),
  _lineHeight: PropTypes.oneOf(Object.keys(baseTheme.fonts.lineHeight)),
  maxLines: PropTypes.number,
};

Text.defaultProps = {
  size: 'large',
  align: 'left',
  color: 'shade.980',
  'data-testid': 'ds-text',
  _weight: 'regular',
  _isUnderlined: false,
  _letterSpacing: 'small',
  maxLines: undefined,
  _lineHeight: 'small',
};

export default Text;
