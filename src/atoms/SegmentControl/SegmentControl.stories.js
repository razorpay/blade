import React from 'react';
import { storiesOf } from '@storybook/react';
import { boolean, select, text } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import Flex from '../Flex';
import View from '../View';
import { getIconNames } from '../../_helpers/icon';
import Text from '../Text';
import Space from '../Space';
import SegmentControl from './SegmentControl';

const iconOptions = getIconNames().reduce(
  (options, option) => ({ ...options, [option]: option }),
  {},
);

const variantOptions = {
  outlined: 'outlined',
  filled: 'filled',
};

const valueOptions = {
  'Option 1': '1',
  'Option 2': '2',
  'Option 3': '3',
};

storiesOf('SegmentControl', module)
  .addParameters({
    component: SegmentControl,
  })
  .add('default', () => (
    <Flex flexDirection="column">
      <View>
        <Space margin={[1, 0, 1, 0]}>
          <View>
            <Text>Small:</Text>
          </View>
        </Space>
        <Flex>
          <View>
            <SegmentControl
              defaultValue="1"
              onChange={(value) => {
                action('Value', value);
              }}
              variant={select('Variant', variantOptions, 'outlined')}
              size="small"
            >
              <SegmentControl.Option value="1" disabled={boolean('Disabled', false)}>
                Option 1
              </SegmentControl.Option>
              <SegmentControl.Option value="2" disabled={boolean('Disabled', false)}>
                Option 2
              </SegmentControl.Option>
              <SegmentControl.Option value="3" disabled={boolean('Disabled', false)}>
                Option 3
              </SegmentControl.Option>
            </SegmentControl>
          </View>
        </Flex>
        <Flex>
          <View>
            <Space margin={[10, 0, 1, 0]}>
              <View>
                <Text>Medium:</Text>
              </View>
            </Space>
            <SegmentControl
              defaultValue="1"
              onChange={(value) => {
                action('Value', value);
              }}
              variant={select('Variant', variantOptions, 'outlined')}
              size="medium"
            >
              <SegmentControl.Option
                value="1"
                icon={select('Icon', iconOptions, undefined)}
                disabled={boolean('Disabled', false)}
                subText={text('Sub Text', undefined)}
              >
                Option 1
              </SegmentControl.Option>
              <SegmentControl.Option
                value="2"
                icon={select('Icon', iconOptions, undefined)}
                disabled={boolean('Disabled', false)}
                subText={text('Sub Text', undefined)}
              >
                Option 2
              </SegmentControl.Option>
              <SegmentControl.Option
                value="3"
                icon={select('Icon', iconOptions, undefined)}
                disabled={boolean('Disabled', false)}
                subText={text('Sub Text', undefined)}
              >
                Option 3
              </SegmentControl.Option>
            </SegmentControl>
          </View>
        </Flex>
      </View>
    </Flex>
  ))
  .add('controlled', () => (
    <Flex flexDirection="column">
      <View>
        <Space margin={[1, 0, 1, 0]}>
          <View>
            <Text>Small:</Text>
          </View>
        </Space>
        <Flex>
          <View>
            <SegmentControl
              value={select('Value', valueOptions, '1')}
              onChange={(value) => {
                action('Value', value);
              }}
              variant={select('Variant', variantOptions, 'outlined')}
              size="small"
            >
              <SegmentControl.Option value="1" disabled={boolean('Disabled', false)}>
                Option 1
              </SegmentControl.Option>
              <SegmentControl.Option value="2" disabled={boolean('Disabled', false)}>
                Option 2
              </SegmentControl.Option>
              <SegmentControl.Option value="3" disabled={boolean('Disabled', false)}>
                Option 3
              </SegmentControl.Option>
            </SegmentControl>
          </View>
        </Flex>
        <Flex>
          <View>
            <Space margin={[10, 0, 1, 0]}>
              <View>
                <Text>Medium:</Text>
              </View>
            </Space>
            <SegmentControl
              value={select('Value', valueOptions, '1')}
              onChange={(value) => {
                action('Value', value);
              }}
              variant={select('Variant', variantOptions, 'outlined')}
              size="medium"
            >
              <SegmentControl.Option
                value="1"
                icon={select('Icon', iconOptions, undefined)}
                disabled={boolean('Disabled', false)}
                subText={text('Sub Text', undefined)}
              >
                Option 1
              </SegmentControl.Option>
              <SegmentControl.Option
                value="2"
                icon={select('Icon', iconOptions, undefined)}
                disabled={boolean('Disabled', false)}
                subText={text('Sub Text', undefined)}
              >
                Option 2
              </SegmentControl.Option>
              <SegmentControl.Option
                value="3"
                icon={select('Icon', iconOptions, undefined)}
                disabled={boolean('Disabled', false)}
                subText={text('Sub Text', undefined)}
              >
                Option 3
              </SegmentControl.Option>
            </SegmentControl>
          </View>
        </Flex>
      </View>
    </Flex>
  ));
