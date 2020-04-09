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
  lineHeight({ theme, size }) {
    switch (size) {
      case 'medium':
        return theme.fonts.lineHeight.medium;
      case 'large':
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

const StyledHeading = styled(Text)`
  &&& {
    font-family: ${({ theme, _weight }) => theme.fonts.family.lato[_weight]};
    font-size: ${styles.fontSize};
    font-weight: ${({ theme, _weight }) => theme.fonts.weight[_weight]};
    color: ${({ theme, color }) => getColor(theme, color)};
    letter-spacing: 0;
    line-height: ${styles.lineHeight};
  }
`;

const Heading = ({ size, testID, color, children, maxLines, weight }) => {
  let headingLevel;
  switch (size) {
    case 'medium':
      headingLevel = 'h5';
      break;
    case 'large':
      headingLevel = 'h4';
      break;
    case 'xlarge':
      headingLevel = 'h3';
      break;
    case 'xxlarge':
      headingLevel = 'h2';
      break;
    case 'xxxlarge':
      headingLevel = 'h1';
      break;
    default:
      headingLevel = 'h2';
  }
  return (
    <StyledHeading
      as={headingLevel}
      size={size}
      color={color}
      maxLines={maxLines}
      _weight={weight}
      {...automation(testID)}
    >
      {children}
    </StyledHeading>
  );
};

Heading.propTypes = {
  children: PropTypes.string,
  size: PropTypes.oneOf(['medium', 'large', 'xlarge', 'xxlarge', 'xxxlarge']),
  color: PropTypes.oneOf(getColorKeys()),
  testID: PropTypes.string,
  maxLines: PropTypes.number,
  weight: PropTypes.oneOf(Object.keys(baseTheme.fonts.weight)),
};

Heading.defaultProps = {
  size: 'xxxlarge',
  color: 'shade.980',
  testID: 'ds-heading',
  weight: 'bold',
  maxLines: undefined,
};

export default Heading;
