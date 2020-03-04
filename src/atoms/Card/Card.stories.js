import React from 'react';
import { storiesOf } from '@storybook/react';
import Card from './Card';
import View from '../View';

storiesOf('Card', module)
  .addParameters({
    component: Card,
  })
  .add('default', () => (
    <Card height="100px" width="100px">
      <View />
    </Card>
  ));
