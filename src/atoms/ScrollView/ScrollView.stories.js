import React from 'react';
import { storiesOf } from '@storybook/react';
import ScrollView from './ScrollView';
import Text from '../Text';

storiesOf('ScrollView', module)
  .addParameters({
    component: ScrollView,
  })
  .add('with text', () => (
    <ScrollView>
      <Text>You can scroll this</Text>
    </ScrollView>
  ));
