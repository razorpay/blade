import React from 'react';
import { storiesOf } from '@storybook/react';
import View from './View';
import Text from '../Text';

storiesOf('View', module)
  .addParameters({
    component: View,
  })
  .add('with text', () => (
    <View>
      <Text>Simple Div</Text>
    </View>
  ));
