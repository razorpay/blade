import React from 'react';
import { storiesOf } from '@storybook/react';
import Heading from './Heading';
import ScrollView from '../ScrollView';
import Space from '../Space';
import View from '../View';

storiesOf('Heading', module)
  .addParameters({
    component: Heading,
  })
  .add('default', () => (
    <ScrollView>
      <Space margin={[4, 0, 0, 0]}>
        <View>
          <Heading size="H7">{'Heading (H7)'}</Heading>
        </View>
      </Space>
      <Space margin={[4, 0, 0, 0]}>
        <View>
          <Heading size="H6">{'Heading (H6)'}</Heading>
        </View>
      </Space>
      <Space margin={[4, 0, 0, 0]}>
        <View>
          <Heading size="H5">{'Heading (H5)'}</Heading>
        </View>
      </Space>
      <Space margin={[4, 0, 0, 0]}>
        <View>
          <Heading size="H4">{'Heading (H4)'}</Heading>
        </View>
      </Space>
      <Space margin={[4, 0, 0, 0]}>
        <View>
          <Heading size="H3">{'Heading (H3)'}</Heading>
        </View>
      </Space>
      <Space margin={[4, 0, 0, 0]}>
        <View>
          <Heading size="H2">{'Heading (H2)'}</Heading>
        </View>
      </Space>
      <Space margin={[4, 0, 0, 0]}>
        <View>
          <Heading size="H1">{'Heading (H1)'}</Heading>
        </View>
      </Space>
    </ScrollView>
  ));
