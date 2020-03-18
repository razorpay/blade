import React from 'react';
import PropTypes from 'prop-types';
import { Text as NativeText, Platform } from 'react-native';
import styled from 'styled-components/native';
import automation from '../../_helpers/automation-attributes';
import Flex from '../Flex';
import Text from '../Text';
import Heading from '../Heading';

const styles = {
  text: {
    color({ size }) {
      switch (size) {
        case 'medium':
        case 'large':
        case 'xlarge':
        case 'xxlarge':
          return 'shade.940';
        case 'xxxlarge':
          return 'shade.950';
        default:
          return 'shade.940';
      }
    },
    size({ size }) {
      switch (size) {
        case 'medium':
          return 'xxsmall';
        case 'large':
          return 'xsmall';
        case 'xlarge':
          return 'medium';
        case 'xxlarge':
          return 'medium';
        case 'xxxlarge':
          return 'large';
        default:
          return 'xxsmall';
      }
    },
    weight({ size }) {
      switch (size) {
        case 'medium':
          return 'regular';
        case 'large':
        case 'xlarge':
        case 'xxlarge':
        case 'xxxlarge':
          return 'bold';
        default:
          return 'bold';
      }
    },
    lineHeight({ size }) {
      switch (size) {
        case 'medium':
          return 'medium';
        case 'large':
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
  },
  baseText: {
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
  },
};

const BaseText = styled(NativeText)`
  align-self: ${styles.baseText.alignSelf};
`;

const getFractionalDisplay = (fractionalPart = '') => {
  switch (fractionalPart.length) {
    case 0:
      return '00';
    case 1:
      return `${fractionalPart}0`;
    case 2:
      return fractionalPart;
    default:
      return fractionalPart.slice(0, 2);
  }
};

const getLocaleString = (numberString) => {
  if (Platform.OS === 'android') {
    // only android needs this polyfill
    require('intl');
    require('intl/locale-data/jsonp/en-IN');
    return new Intl.NumberFormat('en-IN').format(numberString);
  } else {
    return parseInt(numberString, 10).toLocaleString('en-IN');
  }
};

const Amount = ({ size, align, testID, children }) => {
  if (isNaN(children)) {
    throw new Error(`Expected children to be number \n(Eg. "1234", "12.34")`);
  }

  const currency = '₹';

  const [integerPart, fractionPart] = children.split('.');

  const fractionDisplay = getFractionalDisplay(fractionPart);

  return (
    <Flex>
      <BaseText align={align} {...automation(testID)}>
        <Text
          color={styles.text.color({ size })}
          size={styles.text.size({ size })}
          _weight={styles.text.weight({ size })}
          _lineHeight={styles.text.lineHeight({ size })} // First text component within nested texts dictate the line height
        >
          {`${currency} `}
        </Text>
        <Heading color="shade.980" size={size}>
          {getLocaleString(integerPart)}
        </Heading>
        <Text
          color={styles.text.color({ size })}
          size={styles.text.size({ size })}
          _weight={styles.text.weight({ size })}
        >{`.${fractionDisplay}`}</Text>
      </BaseText>
    </Flex>
  );
};

Amount.propTypes = {
  children: PropTypes.string.isRequired,
  size: PropTypes.oneOf(['medium', 'large', 'xlarge', 'xxlarge', 'xxxlarge']),
  align: PropTypes.oneOf(['left', 'center', 'right']),
  testID: PropTypes.string,
};

Amount.defaultProps = {
  size: 'medium',
  align: 'left',
  testID: 'ds-amount',
};

export default Amount;
