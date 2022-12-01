import React from 'react';
import PropTypes from 'prop-types';
import Space from '../Space';
import Text from '../Text';
import { getColorKeys } from '../../_helpers/theme';
import baseTheme from '../../tokens/theme';
import automation from '../../_helpers/automation-attributes';

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

const headingLevel = {
  xxxlarge: 'h1',
  xxlarge: 'h2',
  xlarge: 'h3',
  large: 'h4',
  medium: 'h5',
};

const Heading = ({ size, color, children, maxLines, weight }) => {
  return (
    <Space margin={[0]}>
      <Text
        //@ts-expect-error
        as={headingLevel[size]}
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
        {...automation('ds-heading')}
      >
        {children}
      </Text>
    </Space>
  );
};

Heading.propTypes = {
  children: PropTypes.string,
  size: PropTypes.oneOf(['medium', 'large', 'xlarge', 'xxlarge', 'xxxlarge']).isRequired,
  color: PropTypes.oneOf(getColorKeys()),
  maxLines: PropTypes.number,
  weight: PropTypes.oneOf(Object.keys(baseTheme.bladeOld.fonts.weight)),
};

Heading.defaultProps = {
  color: 'shade.980',
  weight: 'bold',
};

export default Heading;
