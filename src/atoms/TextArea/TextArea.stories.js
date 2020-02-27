import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-ondevice-knobs';
import TextArea from './TextArea';
import { View } from 'react-native';

storiesOf('TextArea', module)
  .addParameters({
    component: TextArea,
  })
  .addDecorator(withKnobs)
  .add('default', () => (
    <View style={{ width: '100%', height: '100%' }}>
      <TextArea placeholder="Hello" prefix="L" />
      <TextArea placeholder="Hello" variant="filled" prefix="L" />
    </View>
  ));
