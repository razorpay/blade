import React from 'react';
import { storiesOf } from '@storybook/react';
import { text, select } from '@storybook/addon-knobs';
import Space from '../../atoms/Space';
import ScrollView from '../../atoms/ScrollView';
import View from '../../atoms/View';
import Size from '../../atoms/Size';
import Text from '../../atoms/Text';
import Amount from './Amount';
import geISOCurrencyList from './geISOCurrencyList';

const currencyOptions = geISOCurrencyList().reduce(
  (options, option) => ({ ...options, [option]: option }),
  {},
);

const variantOptions = {
  camel: 'camel',
  'camel-subtle': 'camel-subtle',
  normal: 'normal',
  'normal-subtle': 'normal-subtle',
};

const weightOptions = {
  bold: 'bold',
  regular: 'regular',
};

storiesOf('Amount', module)
  .addParameters({
    component: Amount,
  })
  .add('default', () => (
    <Size height="100%">
      <ScrollView>
        <Space margin={[4, 0, 0, 0]}>
          <View>
            <Space margin={[0, 0, 1, 0]}>
              <Text>xsmall:</Text>
            </Space>
            <Amount
              size="xsmall"
              currency={select('Currency', currencyOptions, 'INR')}
              variant={select('Variant', variantOptions, 'camel')}
              weight={select('Weight', weightOptions, 'bold')}
            >
              {text('Amount', '1234')}
            </Amount>
          </View>
        </Space>
        <Space margin={[4, 0, 0, 0]}>
          <View>
            <Space margin={[0, 0, 1, 0]}>
              <Text>medium:</Text>
            </Space>
            <Amount
              size="medium"
              currency={select('Currency', currencyOptions, 'INR')}
              variant={select('Variant', variantOptions, 'camel')}
              weight={select('Weight', weightOptions, 'bold')}
            >
              {text('Amount', '1234')}
            </Amount>
          </View>
        </Space>
        <Space margin={[4, 0, 0, 0]}>
          <View>
            <Space margin={[0, 0, 1, 0]}>
              <Text>large:</Text>
            </Space>
            <Amount
              size="large"
              currency={select('Currency', currencyOptions, 'INR')}
              variant={select('Variant', variantOptions, 'camel')}
              weight={select('Weight', weightOptions, 'bold')}
            >
              {text('Amount', '1234')}
            </Amount>
          </View>
        </Space>
        <Space margin={[4, 0, 0, 0]}>
          <View>
            <Space margin={[0, 0, 1, 0]}>
              <Text>xlarge:</Text>
            </Space>
            <Amount
              size="xlarge"
              currency={select('Currency', currencyOptions, 'INR')}
              variant={select('Variant', variantOptions, 'camel')}
              weight={select('Weight', weightOptions, 'bold')}
            >
              {text('Amount', '1234')}
            </Amount>
          </View>
        </Space>
        <Space margin={[4, 0, 0, 0]}>
          <View>
            <Space margin={[0, 0, 1, 0]}>
              <Text>xxlarge:</Text>
            </Space>
            <Amount
              size="xxlarge"
              currency={select('Currency', currencyOptions, 'INR')}
              variant={select('Variant', variantOptions, 'camel')}
              weight={select('Weight', weightOptions, 'bold')}
            >
              {text('Amount', '1234')}
            </Amount>
          </View>
        </Space>
        <Space margin={[4, 0, 0, 0]}>
          <View>
            <Space margin={[0, 0, 1, 0]}>
              <Text>xxxlarge:</Text>
            </Space>
            <Amount
              size="xxxlarge"
              currency={select('Currency', currencyOptions, 'INR')}
              variant={select('Variant', variantOptions, 'camel')}
              weight={select('Weight', weightOptions, 'bold')}
            >
              {text('Amount', '1234')}
            </Amount>
          </View>
        </Space>
      </ScrollView>
    </Size>
  ));
