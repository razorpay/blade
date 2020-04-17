import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { getColorKeys, getColor } from '../../_helpers/theme';
import baseTheme from '../../tokens/theme';
import automation from '../../_helpers/automation-attributes';

import Text from '../Text';

const styles = {
  fontSize({ theme, size }) {
    switch (size) {
      case 'medium':
        return theme.fonts.size.medium;
      case 'large':
        return theme.fonts.size.large;
      case 'xlarge':
        return theme.fonts.size.xxlarge;
      case 'xxlarge':
        return theme.fonts.size.xxxlarge;
      case 'xxxlarge':
        return theme.fonts.size.xxxxlarge;
      default:
        return theme.fonts.size.xxxxlarge;
    }
  },
  lineHeight({ theme, size, _weight }) {
    switch (size) {
      case 'medium':
        return theme.fonts.lineHeight.medium;
      case 'large':
        if (theme.fonts.weight[_weight] === theme.fonts.weight.bold) {
          return theme.fonts.lineHeight.large;
        }
        return theme.fonts.lineHeight.medium;
      case 'xlarge':
        return theme.fonts.lineHeight.xlarge;
      case 'xxlarge':
        return theme.fonts.lineHeight.xxlarge;
      case 'xxxlarge':
        return theme.fonts.lineHeight.xxlarge;
      default:
        return theme.fonts.lineHeight.xxlarge;
    }
  },
};

const StyledHeadingText = styled(Text)`
  &&& {
    font-size: ${styles.fontSize};
    color: ${({ theme, color }) => getColor(theme, color)};
    letter-spacing: 0;
    line-height: ${styles.lineHeight};
  }
`;

const headingLevel = {
  xxxlarge: 'h1',
  xxlarge: 'h2',
  xlarge: 'h3',
  large: 'h4',
  medium: 'h5',
};

const Heading = ({ size, color, children, maxLines, weight }) => {
  return (
    <StyledHeadingText
      as={headingLevel[size]}
      size={size}
      color={color}
      maxLines={maxLines}
      _weight={weight}
      _lineHeight={styles.lineHeight}
      {...automation('ds-heading')}
    >
      {children}
    </StyledHeadingText>
  );
};

Heading.propTypes = {
  children: PropTypes.string,
  size: PropTypes.oneOf(['medium', 'large', 'xlarge', 'xxlarge', 'xxxlarge']),
  color: PropTypes.oneOf(getColorKeys()),
  maxLines: PropTypes.number,
  weight: PropTypes.oneOf(Object.keys(baseTheme.fonts.weight)),
};

Heading.defaultProps = {
  size: 'xxxlarge',
  color: 'shade.980',
  weight: 'bold',
  maxLines: 1,
};

export default Heading;
