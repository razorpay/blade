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
        <Text>Hello1</Text>
        <View>
          <Text>Hello2</Text>
        </View>
      </View>
    </Flex>
  ));
