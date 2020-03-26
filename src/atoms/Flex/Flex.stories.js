import React from 'react';
import { storiesOf } from '@storybook/react';
import Flex from './Flex';
import Text from '../Text';
import View from '../View';

storiesOf('Flex', module)
  .addParameters({
    component: Flex,
  })
  .add('default', () => (
    <Flex>
      <View>
        <Text>Flex Child 1</Text>
        <Text>Flex Child 2</Text>
      </View>
    </Flex>
  ))
  .add('Flex properties', () => (
    <Flex flex={1} flexDirection="row">
      <View>
        <View>Flex Child 1</View>
        <View>Flex Child 2</View>
        <View>Flex Child 3</View>
        <View>Flex Child 4</View>
      </View>
    </Flex>
  ));
