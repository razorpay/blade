import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import baseTheme from '../../tokens/theme';
import isDefined from '../../_helpers/isDefined';
import { getColorKeys, getColor, getLineHeight } from '../../_helpers/theme';

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
  ellipsis({ theme, maxLines, height, size }) {
    const calculatedMaxHeight = parseInt(styles.maxHeight({ theme, size, maxLines }), 10);
    if (isDefined(maxLines) && height >= calculatedMaxHeight) {
      return "'...'";
    }
    return '';
  },
};

const TextBlock = styled.div`
  font-family: ${(props) => props.theme.fonts.family.lato[props._weight]};
  font-weight: ${(props) => props.theme.fonts.weight[props._weight]};
  font-size: ${(props) => props.theme.fonts.size[props.size]};
  color: ${styles.color};
  text-decoration: ${styles.textDecoration};
  text-align: ${(props) => props.align};
  letter-spacing: ${(props) => props.theme.fonts.letterSpacing[props._letterSpacing]};
  line-height: ${styles.lineHeight};
`;

const Wrapper = styled.div`
  max-height: ${styles.maxHeight};
  text-overflow: ${styles.textOverflow};
  overflow: ${styles.overflow};
  position: relative;
  &&:after {
    content: ${styles.ellipsis};
    position: absolute;
    bottom: 0;
    right: 0;
    background: white;
  }
`;

const Text = ({ children, ...otherProps }) => {
  const [height, setHeight] = useState(0);
  const ref = useRef(null);
  const { size, maxLines } = otherProps;

  useEffect(() => {
    setHeight(ref.current.clientHeight);
  });

  return (
    <Wrapper height={height} size={size} maxLines={maxLines}>
      <TextBlock ref={ref} {...otherProps}>
        {children}
      </TextBlock>
    </Wrapper>
  );
};

Text.propTypes = {
  children: PropTypes.string,
  size: PropTypes.oneOf(Object.keys(baseTheme.fonts.size)),
  color: PropTypes.oneOf(getColorKeys()),
  align: PropTypes.oneOf(['left', 'right', 'center', 'justify', 'inherit', 'initial']),
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
  'data-testid': 'ds-text',
  _weight: 'regular',
  _isUnderlined: false,
  _letterSpacing: 'small',
};

export default Text;
