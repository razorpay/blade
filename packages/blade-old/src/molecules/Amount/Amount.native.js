import React from 'react';
import PropTypes from 'prop-types';
import { Text as NativeText } from 'react-native';
import Intl from 'intl';
import automation from '../../_helpers/automation-attributes';
import Flex from '../../atoms/Flex';
import AtomText from '../../atoms/Text';
import Heading from '../../atoms/Heading';
import baseTheme from '../../tokens/theme';
import { getVariantColorKeys } from '../../_helpers/theme';
import geISOCurrencyList from './geISOCurrencyList';
import 'intl/locale-data/jsonp/en-IN';

const styles = {
  text: {
    color({ variant, variantColor, subtle }) {
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
        case 'xsmall':
          return 'small';
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
    color({ variant, variantColor, subtle }) {
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
  const formattedAmount = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currencyDisplay: 'symbol',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

  return formattedAmount;
};

const Amount = ({ size, testID, children, currency, weight, variant, variantColor, subtle }) => {
  if (isNaN(children)) {
    throw new Error(`Expected children to be number \n(Eg. "1234", "12.34")`);
  }

  const formattedAmount = formatAmount({
    amount: children,
    currency,
  });
  const [currencySymbol, amount] = formattedAmount.split(/\s/);
  const [integerPart, fractionPart] = amount.split('.');

  const Text = size === 'xlarge' || size === 'xxlarge' || size === 'xxxlarge' ? Heading : AtomText;

  if (variant === 'normal') {
    return (
      <Text
        color={styles.text.color({
          variant,
          variantColor,
          subtle,
        })}
        size={size}
        weight={weight}
        {...automation(testID)}
      >
        {formattedAmount}
      </Text>
    );
  }

  return (
    <Flex>
      <NativeText {...automation(testID)}>
        <AtomText
          color={styles.text.color({
            variant,
            variantColor,
            subtle,
          })}
          size={styles.text.size({
            size,
          })}
          weight={weight}
          _lineHeight={styles.text.lineHeight({
            size,
          })} // First text component within nested texts dictate the line height
        >
          {`${currencySymbol} `}
        </AtomText>
        <Text
          color={styles.heading.color({
            variant,
            variantColor,
            subtle,
          })}
          size={size}
          weight={weight}
        >
          {integerPart}
        </Text>
        <AtomText
          color={styles.text.color({
            variant,
            variantColor,
            subtle,
          })}
          size={styles.text.size({
            size,
          })}
          weight={weight}
          _lineHeight={styles.text.lineHeight({
            size,
          })}
        >
          {`.${fractionPart}`}
        </AtomText>
      </NativeText>
    </Flex>
  );
};

Amount.propTypes = {
  children: PropTypes.string.isRequired,
  size: PropTypes.oneOf(['xsmall', 'medium', 'large', 'xlarge', 'xxlarge', 'xxxlarge']),
  testID: PropTypes.string,
  currency: PropTypes.oneOf(geISOCurrencyList()),
  weight: PropTypes.oneOf(Object.keys(baseTheme.bladeOld.fonts.weight)),
  variant: PropTypes.oneOf(['camel', 'normal']),
  variantColor: PropTypes.oneOf(getVariantColorKeys()),
  subtle: PropTypes.bool,
};

Amount.defaultProps = {
  size: 'medium',
  testID: 'ds-amount',
  currency: 'INR',
  weight: 'bold',
  variant: 'camel',
  variantColor: 'shade',
  subtle: false,
};

export default Amount;
