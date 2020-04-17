import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { Text as NativeText } from 'react-native';
import { getColorKeys, getColor } from '../../_helpers/theme';
import automation from '../../_helpers/automation-attributes';
import baseTheme from '../../tokens/theme';

const styles = {
  fontFamily({ theme, weight }) {
    return theme.fonts.family.lato[weight];
  },
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
  color({ theme, color }) {
    return getColor(theme, color);
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

const StyledHeading = styled(NativeText)`
  font-family: ${styles.fontFamily};
  font-size: ${styles.fontSize};
  color: ${styles.color};
  letter-spacing: 0;
  line-height: ${styles.lineHeight};
`;

const Heading = ({ size, testID, color, children, maxLines, weight }) => {
  return (
    <StyledHeading
      size={size}
      color={color}
      numberOfLines={maxLines}
      weight={weight}
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
