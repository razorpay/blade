import React from 'react';
import PropTypes from 'prop-types';
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

const Heading = ({ accessibilityLabel, size, testID, color, children, maxLines, weight }) => {
  return (
    <Text
      size={styles.fontSize({
        size,
      })}
      color={color}
      maxLines={maxLines}
      weight={weight}
      _lineHeight={styles.lineHeight({
        size,
        weight,
      })}
      _letterSpacing="small"
      {...automation({ accessibilityLabel, testID })}
    >
      {children}
    </Text>
  );
};

Heading.propTypes = {
  accessibilityLabel: PropTypes.string,
  children: PropTypes.string,
  size: PropTypes.oneOf(['medium', 'large', 'xlarge', 'xxlarge', 'xxxlarge']).isRequired,
  color: PropTypes.oneOf(getColorKeys()),
  testID: PropTypes.string,
  maxLines: PropTypes.number,
  weight: PropTypes.oneOf(Object.keys(baseTheme.fonts.weight)),
};

Heading.defaultProps = {
  accessibilityLabel: null,
  color: 'shade.980',
  testID: 'ds-heading',
  weight: 'bold',
};

export default Heading;
