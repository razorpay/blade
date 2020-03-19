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
  maxHeight({ theme, truncate, _lineHeight, numberOfLines }) {
    if (truncate) {
      const lineHeight = `${theme.fonts.lineHeight[_lineHeight]}`.replace('px', '');
      const height = `${lineHeight * numberOfLines}px`;
      return height;
    } else {
      return 'initial';
    }
  },
};

const Text = styled.div`
  font-family: ${styles.fontFamily};
  font-size: ${styles.fontSize};
  color: ${styles.color};
  text-decoration-line: ${(props) => (props._isUnderlined ? 'underline' : 'none')};
  align-self: ${styles.align};
  letter-spacing: ${styles.letterSpacing};
  line-height: ${styles.lineHeight};
  overflow: ${(props) => (props.truncate ? 'hidden' : '')};
  white-space: ${(props) => (props.truncate ? 'nowrap' : '')};
  text-overflow: ${(props) => (props.truncate ? 'ellipsis' : '')};
  max-height: ${styles.maxHeight};
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
  truncate: PropTypes.bool,
  numberOfLines: PropTypes.number,
};

Text.defaultProps = {
  size: 'large',
  align: 'left',
  color: 'shade.980',
  'data-testid': 'ds-text',
  _weight: 'regular',
  _isUnderlined: false,
  _letterSpacing: 'small',
  truncate: false,
  numberOfLines: 1,
  _lineHeight: 'small',
};

export default Text;
