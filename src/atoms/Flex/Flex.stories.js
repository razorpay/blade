import React from 'react';
import { storiesOf } from '@storybook/react';
import { select, text } from '@storybook/addon-knobs';
import Text from '../Text';
import View from '../View';
import Space from '../Space';
import Flex from './Flex';

const fillOptions = {
  row: 'row',
  column: 'column',
};

const justifyContentOptions = {
  'space-evenly': 'space-evenly',
  center: 'center',
  'flex-end': 'flex-end',
  'flex-start': 'flex-start',
  'space-around': 'space-around',
  'space-between': 'space-between',
};

storiesOf('Flex', module)
  .addParameters({
    component: Flex,
  })
  .add('default', () => (
    <Flex>
      <View>
        <Text>{text('Display Text', 'Flex child #1')}</Text>
        <Text>{text('Display Text', 'Flex child #2')}</Text>
      </View>
    </Flex>
  ))
  .add('flex justify-content', () => (
    <Flex
      justifyContent={select('justify-content', justifyContentOptions, 'center')}
      flexDirection="row"
    >
      <View>
        <Text>{text('Display Text', 'Flex child #1')}</Text>
        <Text>{text('Display Text', 'Flex child #2')}</Text>
      </View>
    </Flex>
  ))
  .add('Flex directions', () => (
    <Flex flexDirection={select('Direction', fillOptions, 'row')}>
      <View as="div">
        <Space margin={[1, 2]}>
          <View>Flex Child #1</View>
        </Space>
        <Space padding={[1, 2]}>
          <View>Flex Child #2</View>
        </Space>
        <Space padding={[1, 2]}>
          <View>Flex Child #3</View>
        </Space>
        <Space margin={[1, 2]}>
          <View>Flex Child #4</View>
        </Space>
      </View>
    </Flex>
  ))
  .add('Flex with spacing and children', () => (
    <Space margin={[1, 1]} padding={[1, 1]}>
      <Flex flexDirection="row">
        <View>
          <Space margin={[1, 1]} padding={[1, 1]}>
            <View>Flex Child #1</View>
          </Space>
          <Space margin={[1, 1]} padding={[1, 1]}>
            <View>Flex Child #2</View>
          </Space>
        </View>
      </Flex>
    </Space>
  ))
  .add('Flex flex', () => (
    <Flex flex={1}>
      <View as="div">
        <View>Flex Child #1</View>
        <View>Flex Child #2</View>
        <View>Flex Child #3</View>
        <View>Flex Child #4</View>
      </View>
    </Flex>
  ));
