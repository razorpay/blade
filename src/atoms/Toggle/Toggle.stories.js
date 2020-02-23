import React from 'react';
import { storiesOf } from '@storybook/react';
import { View } from 'react-native';
import Toggle from './Toggle';

storiesOf('Toggle', module)
  .addParameters({
    component: Toggle,
  })
  .add('Toggle', () => (
    <View style={{ height: '100%', justifyContent: 'center', alignItems: 'center' }}>
      <Toggle />
    </View>
  ));
