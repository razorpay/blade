import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { Text as NativeText } from 'react-native';
import { getColorKeys, getColor } from '../../_helpers/theme';
import automation from '../../_helpers/automation-attributes';

const styles = {
  fontFamily({ theme, size }) {
    switch (size) {
      case 'H7':
      case 'H6':
      case 'H4':
      case 'H3':
      case 'H2':
      case 'H1':
        return theme.fonts.family.lato.bold;
      case 'H5':
        return theme.fonts.family.lato.regular;
      default:
        return theme.fonts.family.lato.bold;
    }
  },
  fontSize({ theme, size }) {
    switch (size) {
      case 'H7':
        return theme.fonts.size.xsmall;
      case 'H6':
        return theme.fonts.size.medium;
      case 'H5':
        return theme.fonts.size.large;
      case 'H4':
        return theme.fonts.size.large;
      case 'H3':
        return theme.fonts.size.xxlarge;
      case 'H2':
        return theme.fonts.size.xxxlarge;
      case 'H1':
        return theme.fonts.size.xxxxlarge;
      default:
        return theme.fonts.size.xxxxlarge;
    }
  },
  color({ theme, color }) {
    return getColor(theme, color);
  },
  alignSelf({ align }) {
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
  letterSpacing({ theme, size }) {
    switch (size) {
      case 'H7':
        return theme.fonts.letterSpacing.medium;
      case 'H6':
        return theme.fonts.letterSpacing.large;
      case 'H5':
        return theme.fonts.letterSpacing.small;
      case 'H4':
        return theme.fonts.letterSpacing.large;
      case 'H3':
        return theme.fonts.letterSpacing.small;
      case 'H2':
        return theme.fonts.letterSpacing.small;
      case 'H1':
        return theme.fonts.letterSpacing.small;
      default:
        return theme.fonts.letterSpacing.small;
    }
  },
  lineHeight({ theme, size }) {
    switch (size) {
      case 'H7':
        return theme.fonts.lineHeight.medium;
      case 'H6':
        return theme.fonts.lineHeight.medium;
      case 'H5':
        return theme.fonts.lineHeight.medium;
      case 'H4':
        return theme.fonts.lineHeight.large;
      case 'H3':
        return theme.fonts.lineHeight.xlarge;
      case 'H2':
        return theme.fonts.lineHeight.xxlarge;
      case 'H1':
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
  align-self: ${styles.alignSelf};
  letter-spacing: ${styles.letterSpacing};
  line-height: ${styles.lineHeight};
`;

const Heading = ({ size, align, testID, color, children, numberOfLines }) => {
  return (
    <StyledHeading
      size={size}
      align={align}
      color={color}
      numberOfLines={numberOfLines}
      {...automation(testID)}
    >
      {children}
    </StyledHeading>
  );
};

Heading.propTypes = {
  children: PropTypes.string,
  size: PropTypes.oneOf(['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'H7']),
  color: PropTypes.oneOf(getColorKeys()),
  align: PropTypes.oneOf(['left', 'center', 'right']),
  testID: PropTypes.string,
  numberOfLines: PropTypes.number,
};

Heading.defaultProps = {
  size: 'H1',
  align: 'left',
  color: 'shade.980',
  testID: 'ds-heading',
};

export default Heading;
