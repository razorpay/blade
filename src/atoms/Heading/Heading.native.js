import React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from 'styled-components';
import Text from '../Text';
import { getColorKeys } from '../../_helpers/theme';
import automation from '../../_helpers/automation-attributes';
import baseTheme from '../../tokens/theme';

const styles = {
  fontSize({ size }) {
    switch (size) {
      case 'medium':
        return 'medium';
      case 'large':
        return 'large';
      case 'xlarge':
        return 'xxlarge';
      case 'xxlarge':
        return 'xxxlarge';
      case 'xxxlarge':
        return 'xxxxlarge';
      default:
        return 'xxxxlarge';
    }
  },
  lineHeight({ size, weight }) {
    switch (size) {
      case 'medium':
        return 'medium';
      case 'large':
        if (weight === 'bold') {
          return 'large';
        }
        return 'medium';
      case 'xlarge':
        return 'xlarge';
      case 'xxlarge':
        return 'xxlarge';
      case 'xxxlarge':
        return 'xxlarge';
      default:
        return 'xxlarge';
    }
  },
};

const Heading = ({ size, testID, color, children, maxLines, weight }) => {
  const theme = useTheme();

  return (
    <Text
      size={styles.fontSize({ theme, size })}
      color={color}
      maxLines={maxLines}
      _weight={weight}
      _lineHeight={styles.lineHeight({ theme, size, weight })}
      _letterSpacing="small"
      {...automation(testID)}
    >
      {children}
    </Text>
  );
};

Heading.propTypes = {
  children: PropTypes.string,
  size: PropTypes.oneOf(['medium', 'large', 'xlarge', 'xxlarge', 'xxxlarge']).isRequired,
  color: PropTypes.oneOf(getColorKeys()),
  testID: PropTypes.string,
  maxLines: PropTypes.number,
  weight: PropTypes.oneOf(Object.keys(baseTheme.fonts.weight)),
};

Heading.defaultProps = {
  color: 'shade.980',
  testID: 'ds-heading',
  weight: 'bold',
};

export default Heading;
