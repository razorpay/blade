import React from 'react';
import { storiesOf } from '@storybook/react';
import Heading from './Heading';
import ScrollView from '../ScrollView';
import Space from '../Space';
import View from '../View';
import { select } from '@storybook/addon-knobs';

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
          <Heading size="medium" weight={select('Weight', weightOptions, 'bold')}>
            {'Heading (medium)'}
          </Heading>
        </View>
      </Space>
      <Space margin={[4, 0, 0, 0]}>
        <View>
          <Heading size="large" weight={select('Weight', weightOptions, 'bold')}>
            {'Heading (large)'}
          </Heading>
        </View>
      </Space>
      <Space margin={[4, 0, 0, 0]}>
        <View>
          <Heading size="xlarge" weight={select('Weight', weightOptions, 'bold')}>
            {'Heading (xlarge)'}
          </Heading>
        </View>
      </Space>
      <Space margin={[4, 0, 0, 0]}>
        <View>
          <Heading size="xxlarge" weight={select('Weight', weightOptions, 'bold')}>
            {'Heading (xxlarge)'}
          </Heading>
        </View>
      </Space>
      <Space margin={[4, 0, 0, 0]}>
        <View>
          <Heading size="xxxlarge" weight={select('Weight', weightOptions, 'bold')}>
            {'Heading (xxxlarge)'}
          </Heading>
        </View>
      </Space>
    </ScrollView>
  ));
