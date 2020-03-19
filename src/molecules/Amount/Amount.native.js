import React from 'react';
import PropTypes from 'prop-types';
import { Text as NativeText, Platform } from 'react-native';
import automation from '../../_helpers/automation-attributes';
import Flex from '../../atoms/Flex';
import Text from '../../atoms/Text';
import Heading from '../../atoms/Heading';
import { geISOCurrencyList } from '../../_helpers/currency';

const IS_ANDROID = Platform.OS === 'android';

const styles = {
  text: {
    color({ size }) {
      if (size === 'xxxlarge') {
        return 'shade.950';
      }

      return 'shade.940';
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
          return 'bold';
        case 'xlarge':
          return 'bold';
        case 'xxlarge':
          return 'bold';
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
};

const formatAmount = ({ amount, currency }) => {
  if (IS_ANDROID) {
    // Polyfill for Android
    require('intl');
    require('intl/locale-data/jsonp/en-IN');
  }

  const formattedAmount = (+amount).toLocaleString('en-IN', {
    style: 'currency',
    currencyDisplay: 'symbol',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return formattedAmount;
};

const Amount = ({ size, testID, children, currency }) => {
  if (isNaN(children)) {
    throw new Error(`Expected children to be number \n(Eg. "1234", "12.34")`);
  }

  const formattedAmount = formatAmount({ amount: children, currency });
  const [currencySymbol, amount] = formattedAmount.split(/\s/);
  const [integerPart, fractionPart] = amount.split('.');

  return (
    <Flex>
      <NativeText {...automation(testID)}>
        <Text
          color={styles.text.color({ size })}
          size={styles.text.size({ size })}
          _weight={styles.text.weight({ size })}
          _lineHeight={styles.text.lineHeight({ size })} // First text component within nested texts dictate the line height
        >
          {`${currencySymbol} `}
        </Text>
        <Heading color="shade.980" size={size}>
          {integerPart}
        </Heading>
        <Text
          color={styles.text.color({ size })}
          size={styles.text.size({ size })}
          _weight={styles.text.weight({ size })}
        >{`.${fractionPart}`}</Text>
      </NativeText>
    </Flex>
  );
};

Amount.propTypes = {
  children: PropTypes.string.isRequired,
  size: PropTypes.oneOf(['medium', 'large', 'xlarge', 'xxlarge', 'xxxlarge']),
  testID: PropTypes.string,
  currency: PropTypes.oneOf(geISOCurrencyList()),
};

Amount.defaultProps = {
  size: 'medium',
  testID: 'ds-amount',
  currency: 'INR',
};

export default Amount;
