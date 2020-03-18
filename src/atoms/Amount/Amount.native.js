import React from 'react';
import PropTypes from 'prop-types';
import { Text as NativeText } from 'react-native';
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
  },
  baseText: {
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
  },
};

const BaseText = styled(NativeText)`
  line-height: ${styles.baseText.lineHeight};
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

const Amount = ({ size, align, testID, children }) => {
  if (isNaN(children)) {
    throw new Error(`Expected children to be number \n(Eg. "1234", "12.34")`);
  }

  const currency = '₹';

  const [wholePart, fractionPart] = children.split('.');

  const fractionDisplay = getFractionalDisplay(fractionPart);

  return (
    <Flex>
      <BaseText {...automation(testID)}>
        <Text
          color={styles.text.color({ size })}
          size={styles.text.size({ size })}
          align={align}
          _weight={styles.text.weight({ size })}
        >
          {`${currency} `}
        </Text>
        <Heading color="shade.980" size={size}>
          {parseInt(wholePart, 10).toLocaleString('en-IN')}
        </Heading>
        <Text
          color={styles.text.color({ size })}
          size={styles.text.size({ size })}
          align={align}
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
