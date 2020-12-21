import PropTypes from 'prop-types';
import styled from 'styled-components';
import baseTheme from '../../tokens/theme';
import isDefined from '../../_helpers/isDefined';
import { getColorKeys, getColor, getLineHeight } from '../../_helpers/theme';
import automationAttributes from '../../_helpers/automation-attributes';

const styles = {
  color({ theme, color }) {
    return getColor(theme, color);
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
  letterSpacing({ theme, _letterSpacing }) {
    return `${theme.fonts.letterSpacing[_letterSpacing]}px`;
  },
};

const Text = styled.div.attrs((props: any) => ({
  ...automationAttributes(props.testID),
}))`
  font-family: ${(props: any) => props.theme.fonts.family.lato[props.weight]};
  font-weight: ${(props: any) => props.theme.fonts.weight[props.weight]};
  font-size: ${(props: any) => props.theme.fonts.size[props.size]};
  color: ${styles.color};
  text-decoration: ${styles.textDecoration};
  text-align: ${(props: any) => props.align};
  letter-spacing: ${styles.letterSpacing};
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
  size: PropTypes.oneOf(Object.keys(baseTheme.fonts.size)),
  color: PropTypes.oneOf(getColorKeys()),
  align: PropTypes.oneOf(['left', 'right', 'center', 'justify', 'inherit', 'initial']),
  testID: PropTypes.string,
  maxLines: PropTypes.number,
  weight: PropTypes.oneOf(Object.keys(baseTheme.fonts.weight)),
  _isUnderlined: PropTypes.bool,
  _letterSpacing: PropTypes.oneOf(Object.keys(baseTheme.fonts.letterSpacing)),
  _lineHeight: PropTypes.oneOf(Object.keys(baseTheme.fonts.lineHeight)),
};

Text.defaultProps = {
  size: 'large',
  align: 'left',
  color: 'shade.980',
  testID: 'ds-text',
  weight: 'regular',
  _isUnderlined: false,
  _letterSpacing: 'small',
};

export default Text;
