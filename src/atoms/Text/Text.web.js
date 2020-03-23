import PropTypes from 'prop-types';
import styled from 'styled-components';
import baseTheme from '../../tokens/theme';
import isDefined from '../../_helpers/isDefined';
import { getColorKeys, getColor, getLineHeight } from '../../_helpers/theme';

const styles = {
  color({ theme, color }) {
    return getColor(theme, color);
  },
  align({ align }) {
    switch (align) {
      case 'left':
        return 'flex-start';
      case 'center':
        return 'center';
      case 'right':
        return 'flex-end';
      default:
        return 'flex-start';
    }
  },
  lineHeight({ theme, size, _lineHeight }) {
    if (_lineHeight) {
      return theme.fonts.lineHeight[_lineHeight];
    } else {
      return getLineHeight(theme, size);
    }
  },
  maxHeight({ theme, size, maxLines }) {
    if (isDefined(maxLines)) {
      const lineHeight = getLineHeight(theme, size);
      const maxHeight = `${parseFloat(lineHeight) * maxLines}px`;
      return maxHeight;
    }
    return 'initial';
  },
  overflow({ maxLines }) {
    if (isDefined(maxLines)) {
      return 'hidden';
    }
    return 'initial';
  },
  textOverflow({ maxLines }) {
    if (isDefined(maxLines)) {
      return 'ellipsis';
    }
    return 'initial';
  },
  textDecoration({ _isUnderlined }) {
    if (_isUnderlined) {
      return 'underline';
    }
    return 'none';
  },
  ellipsis({ maxLines }) {
    if (isDefined(maxLines)) {
      return "'...'";
    }
    return '';
  },
};

const Text = styled.div`
  font-family: ${(props) => props.theme.fonts.family.lato[props._weight]};
  font-size: ${(props) => props.theme.fonts.size[props.size]};
  color: ${styles.color};
  text-decoration: ${styles.textDecoration};
  align-self: ${styles.align};
  letter-spacing: ${(props) => props.theme.fonts.letterSpacing[props._letterSpacing]};
  line-height: ${styles.lineHeight};
  overflow: ${styles.overflow};
  text-overflow: ${styles.textOverflow};
  max-height: ${styles.maxHeight};
  position: relative;
  &&:after {
    content: ${styles.ellipsis};
    position: absolute;
    bottom: 0;
    right: 0;
    background: white;
  }
`;

Text.propTypes = {
  size: PropTypes.oneOf(['xxsmall', 'xsmall', 'small', 'medium', 'large']),
  color: PropTypes.oneOf(getColorKeys()),
  align: PropTypes.oneOf(['left', 'center', 'right']),
  'data-testid': PropTypes.string,
  maxLines: PropTypes.number,
  _weight: PropTypes.oneOf(Object.keys(baseTheme.fonts.weight)),
  _isUnderlined: PropTypes.bool,
  _letterSpacing: PropTypes.oneOf(Object.keys(baseTheme.fonts.letterSpacing)),
  _lineHeight: PropTypes.oneOf(Object.keys(baseTheme.fonts.lineHeight)),
};

Text.defaultProps = {
  size: 'large',
  align: 'left',
  color: 'shade.980',
  maxLines: undefined,
  'data-testid': 'ds-text',
  _weight: 'regular',
  _isUnderlined: false,
  _letterSpacing: 'small',
};

export default Text;
