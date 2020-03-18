import React from 'react';
import { storiesOf } from '@storybook/react';
import { text } from '@storybook/addon-knobs';
import Amount from './Amount';
import Space from '../../atoms/Space';
import ScrollView from '../../atoms/ScrollView';
import View from '../../atoms/View';
import Size from '../../atoms/Size';

storiesOf('Amount', module)
  .addParameters({
    component: Amount,
  })
  .add('default', () => (
    <Size height="100%">
      <ScrollView>
        <Space margin={[4, 0, 0, 0]}>
          <View>
            <Amount size="medium">{text('Amount', '1234')}</Amount>
          </View>
        </Space>
        <Space margin={[4, 0, 0, 0]}>
          <View>
            <Amount size="large">{text('Amount', '1234')}</Amount>
          </View>
        </Space>
        <Space margin={[4, 0, 0, 0]}>
          <View>
            <Amount size="xlarge">{text('Amount', '1234')}</Amount>
          </View>
        </Space>
        <Space margin={[4, 0, 0, 0]}>
          <View>
            <Amount size="xxlarge">{text('Amount', '1234')}</Amount>
          </View>
        </Space>
        <Space margin={[4, 0, 0, 0]}>
          <View>
            <Amount size="xxxlarge">{text('Amount', '1234')}</Amount>
          </View>
        </Space>
      </ScrollView>
    </Size>
  ));
