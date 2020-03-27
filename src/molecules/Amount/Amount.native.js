import React from 'react';
import PropTypes from 'prop-types';
import { Text as NativeText, Platform } from 'react-native';
import automation from '../../_helpers/automation-attributes';
import Flex from '../../atoms/Flex';
import Text from '../../atoms/Text';
import Heading from '../../atoms/Heading';
import baseTheme from '../../tokens/theme';
import { getVariantColorKeys } from '../../_helpers/theme';
import geISOCurrencyList from './geISOCurrencyList';

const IS_ANDROID = Platform.OS === 'android';

const styles = {
  text: {
    color({ variantColor, variant, subtle }) {
      switch (variant) {
        case 'camel':
          return `${variantColor}.950`;
        case 'normal':
          if (subtle) {
            return `${variantColor}.960`;
          }
          return `${variantColor}.980`;
        default:
          return `${variantColor}.950`;
      }
    },
    size({ size }) {
      switch (size) {
        case 'xsmall':
          return 'xxsmall';
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
  heading: {
    color({ variantColor, variant, subtle }) {
      switch (variant) {
        case 'camel':
          if (subtle) {
            return `${variantColor}.950`;
          }
          return `${variantColor}.980`;
        case 'normal':
          if (subtle) {
            return `${variantColor}.960`;
          }
          return `${variantColor}.980`;
        default:
          return `${variantColor}.980`;
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

const Amount = ({ size, testID, children, currency, weight, variantColor, variant, subtle }) => {
  if (isNaN(children)) {
    throw new Error(`Expected children to be number \n(Eg. "1234", "12.34")`);
  }

  const formattedAmount = formatAmount({ amount: children, currency });
  const [currencySymbol, amount] = formattedAmount.split(/\s/);
  const [integerPart, fractionPart] = amount.split('.');

  const IntegerComponent =
    size === 'xlarge' || size === 'xxlarge' || size === 'xxxlarge' ? Heading : Text;

  if (variant === 'normal') {
    return (
      <IntegerComponent
        color={styles.text.color({ variantColor, variant, subtle })}
        size={size}
        _weight={weight}
        weight={weight}
        {...automation(testID)}
      >
        {formattedAmount}
      </IntegerComponent>
    );
  }

  return (
    <Flex>
      <NativeText {...automation(testID)}>
        <Text
          color={styles.text.color({ variantColor, variant, subtle })}
          size={styles.text.size({ size })}
          _weight={weight}
          _lineHeight={styles.text.lineHeight({ size })} // First text component within nested texts dictate the line height
        >
          {`${currencySymbol} `}
        </Text>
        <IntegerComponent
          color={styles.heading.color({ variantColor, variant, subtle })}
          size={size}
          weight={weight}
          _weight={weight}
        >
          {integerPart}
        </IntegerComponent>
        <Text
          color={styles.text.color({ variantColor, variant, subtle })}
          size={styles.text.size({ size })}
          _weight={weight}
        >{`.${fractionPart}`}</Text>
      </NativeText>
    </Flex>
  );
};

Amount.propTypes = {
  children: PropTypes.string.isRequired,
  size: PropTypes.oneOf(['xsmall', 'medium', 'large', 'xlarge', 'xxlarge', 'xxxlarge']),
  testID: PropTypes.string,
  currency: PropTypes.oneOf(geISOCurrencyList()),
  variant: PropTypes.oneOf(['camel', 'normal']),
  weight: PropTypes.oneOf(Object.keys(baseTheme.fonts.weight)),
  variantColor: PropTypes.oneOf(getVariantColorKeys()),
  subtle: PropTypes.bool,
};

Amount.defaultProps = {
  size: 'medium',
  testID: 'ds-amount',
  currency: 'INR',
  variant: 'camel',
  weight: 'bold',
  variantColor: 'shade',
  subtle: false,
};

export default Amount;
