import React from 'react';
import { storiesOf } from '@storybook/react';
import Tab from './Tab';
import Flex from '../Flex';
import View from '../View';

storiesOf('Tabs', module)
  .addParameters({
    component: Tab,
  })
  .add('default', () => (
    <View>
      <Flex flexDirection="row">
        <View>
          <Tab active={true} label="Selected with icon" icon="info" />
        </View>
      </Flex>
      <Flex flexDirection="row">
        <View>
          <Tab active={false} label="Unselected with icon" icon="info" />
        </View>
      </Flex>
      <Flex flexDirection="row">
        <View>
          <Tab active={false} disabled={true} label="Unselected with disabled" />
        </View>
      </Flex>
      <Flex flexDirection="row">
        <View>
          <Tab active={true} disabled={true} label="Selected with disabled" />
        </View>
      </Flex>
    </View>
  ))
  .add('with Tabs Container', () => (
    <Flex flexDirection="row">
      <View>
        <Tab active={true} label="Selected with icon" icon="info" />
        <Tab active={false} label="Unselected with icon" icon="info" />
      </View>
    </Flex>
  ));
