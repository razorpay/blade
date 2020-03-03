import React from 'react';
import { storiesOf } from '@storybook/react';
import View from './View';

storiesOf('View', module)
  .addParameters({
    component: View,
  })
  .add('with text', () => <View>Simple Div</View>);
