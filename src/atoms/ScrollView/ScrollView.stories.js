import React from 'react';
import { storiesOf } from '@storybook/react';
import Text from '../Text';
import ScrollView from './ScrollView';

storiesOf('ScrollView', module)
  .addParameters({
    component: ScrollView,
  })
  .add('with text', () => (
    <ScrollView>
      <Text>You can scroll this</Text>
    </ScrollView>
  ));
