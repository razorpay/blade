import React from 'react';
import { storiesOf } from '@storybook/react';
import { select, number, text } from '@storybook/addon-knobs';
import ScrollView from '../ScrollView';
import Space from '../Space';
import View from '../View';
import Heading from './Heading';

const weightOptions = {
  regular: 'regular',
  bold: 'bold',
};

storiesOf('Heading', module)
  .addParameters({
    component: Heading,
  })
  .add('default', () => (
    <ScrollView>
      <Space margin={[4, 0, 0, 0]}>
        <View>
          <Heading size="medium">{'Heading (medium)'}</Heading>
        </View>
      </Space>
      <Space margin={[4, 0, 0, 0]}>
        <View>
          <Heading size="large">{'Heading (large)'}</Heading>
        </View>
      </Space>
      <Space margin={[4, 0, 0, 0]}>
        <View>
          <Heading size="xlarge">{'Heading (xlarge)'}</Heading>
        </View>
      </Space>
      <Space margin={[4, 0, 0, 0]}>
        <View>
          <Heading size="xxlarge">{'Heading (xxlarge)'}</Heading>
        </View>
      </Space>
      <Space margin={[4, 0, 0, 0]}>
        <View>
          <Heading size="xxxlarge">{'Heading (xxxlarge)'}</Heading>
        </View>
      </Space>
    </ScrollView>
  ))
  .add('with weight', () => (
    <ScrollView>
      <Space margin={[4, 0, 0, 0]}>
        <View>
          <Heading size="medium" weight={select('Weight', weightOptions, 'bold')}>
            {'The quick brown fox jumps over the lazy dog'}
          </Heading>
        </View>
      </Space>
    </ScrollView>
  ))
  .add('with maxLines', () => (
    <ScrollView>
      <Space margin={[4, 0, 0, 0]}>
        <View>
          <Heading size="medium" maxLines={number('maxLines', 1)}>
            {text('Text', 'The quick brown fox jumps over the lazy dog')}
          </Heading>
        </View>
      </Space>
    </ScrollView>
  ));
