import React from 'react';
import { storiesOf } from '@storybook/react';
import Text from '../../atoms/Text';
import Tabs from './Tabs';

storiesOf('Tabs', module)
  .addParameters({
    component: Tabs,
  })
  .add('default', () => (
    <Tabs>
      <Tabs.Tab title="One">
        <Text>Screen 1</Text>
      </Tabs.Tab>
      <Tabs.Tab title="Two">
        <Text>Screen 2</Text>
      </Tabs.Tab>
    </Tabs>
  ));
