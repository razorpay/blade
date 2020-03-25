import React from 'react';
import { storiesOf } from '@storybook/react';
import { text, select } from '@storybook/addon-knobs';
import Space from '../../atoms/Space';
import ScrollView from '../../atoms/ScrollView';
import View from '../../atoms/View';
import Size from '../../atoms/Size';
import Amount from './Amount';
import geISOCurrencyList from './geISOCurrencyList';

const currencyOptions = geISOCurrencyList().reduce(
  (options, option) => ({ ...options, [option]: option }),
  {},
);

storiesOf('Amount', module)
  .addParameters({
    component: Amount,
  })
  .add('default', () => (
    <Size height="100%">
      <ScrollView>
        <Space margin={[4, 0, 0, 0]}>
          <View>
            <Amount size="medium" currency={select('Currency', currencyOptions, 'INR')}>
              {text('Amount', '1234')}
            </Amount>
          </View>
        </Space>
        <Space margin={[4, 0, 0, 0]}>
          <View>
            <Amount size="large" currency={select('Currency', currencyOptions, 'INR')}>
              {text('Amount', '1234')}
            </Amount>
          </View>
        </Space>
        <Space margin={[4, 0, 0, 0]}>
          <View>
            <Amount size="xlarge" currency={select('Currency', currencyOptions, 'INR')}>
              {text('Amount', '1234')}
            </Amount>
          </View>
        </Space>
        <Space margin={[4, 0, 0, 0]}>
          <View>
            <Amount size="xxlarge" currency={select('Currency', currencyOptions, 'INR')}>
              {text('Amount', '1234')}
            </Amount>
          </View>
        </Space>
        <Space margin={[4, 0, 0, 0]}>
          <View>
            <Amount size="xxxlarge" currency={select('Currency', currencyOptions, 'INR')}>
              {text('Amount', '1234')}
            </Amount>
          </View>
        </Space>
      </ScrollView>
    </Size>
  ));
