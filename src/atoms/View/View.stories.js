import React from 'react';
import { storiesOf } from '@storybook/react';
import Text from '../Text';
import View from './View';

storiesOf('View', module)
  .addParameters({
    component: View,
  })
  .add('with text', () => (
    <View>
      <Text>Simple Div</Text>
    </View>
  ));
