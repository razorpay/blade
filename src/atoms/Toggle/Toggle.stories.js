import React from 'react';
import { storiesOf } from '@storybook/react';
import { View } from 'react-native';
import Toggle from './Toggle';

storiesOf('Toggle', module)
  .addParameters({
    component: Toggle,
  })
  .add('Toggle', () => (
    <View style={{ height: '100%', justifyContent: 'space-around', alignItems: 'center' }}>
      <Toggle align="center" size="large" />
      {/* <Toggle /> */}
      {/*eslint-disable-next-line no-alert */}
      {/* <Toggle onValueChange={(value) => alert(value)} />
      <Toggle disabled />
      <Toggle disabled value={true} align="right" /> */}
    </View>
  ));
