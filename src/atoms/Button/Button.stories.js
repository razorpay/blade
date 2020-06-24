import React from 'react';
import { storiesOf } from '@storybook/react';
import { select, boolean } from '@storybook/addon-knobs';

import Flex from '../Flex';
import View from '../View';
import Space from '../../atoms/Space';
import Button from './Button';

const variants = {
  primary: 'primary',
  secondary: 'secondary',
  tertiary: 'tertiary',
};

const sizes = {
  xsmall: 'xsmall',
  small: 'small',
  medium: 'medium',
  large: 'large',
};

const iconAlign = {
  left: 'left',
  right: 'right',
};

storiesOf('Button', module)
  .addParameters({
    component: Button,
  })
  .add('default', () => (
    <Flex flex={1} justifyContent="space-around" flexDirection="column">
      <View>
        <Space margin={[4, 0, 0, 0]}>
          <View>
            <Button
              size={select('Sizes', sizes, 'medium')}
              variant={select('Variants', variants, 'primary')}
              block
              disabled={boolean('Disabled', false)}
            >
              Block Button
            </Button>
          </View>
        </Space>
        <Space margin={[4, 0, 0, 0]}>
          <View>
            <Button
              size={select('Sizes', sizes, 'medium')}
              variant={select('Variants', variants, 'primary')}
              disabled={boolean('Disabled', false)}
            >
              Button
            </Button>
          </View>
        </Space>
      </View>
    </Flex>
  ))
  .add('With Icon', () => (
    <Flex flex={1} justifyContent="space-around" flexDirection="column">
      <View>
        <Space margin={[4, 0, 0, 0]}>
          <View>
            <Button
              size={select('Sizes', sizes, 'medium')}
              variant={select('Variants', variants, 'primary')}
              icon="info"
              iconAlign={select('Icon Align', iconAlign, 'left')}
              disabled={boolean('Disabled', false)}
              block
            >
              Block Button
            </Button>
          </View>
        </Space>
        <Space margin={[4, 0, 0, 0]}>
          <View>
            <Button
              size={select('Sizes', sizes, 'medium')}
              variant={select('Variants', variants, 'primary')}
              icon="info"
              iconAlign={select('Icon Align', iconAlign, 'left')}
              disabled={boolean('Disabled', false)}
            >
              Button
            </Button>
          </View>
        </Space>
      </View>
    </Flex>
  ))
  .add('Icon Only', () => (
    <Flex flex={1} justifyContent="space-around" flexDirection="column">
      <View>
        <Space margin={[4, 0, 0, 0]}>
          <View>
            <Button
              size={select('Sizes', sizes, 'medium')}
              variant={select('Variants', variants, 'primary')}
              icon="info"
              disabled={boolean('Disabled', false)}
            />
          </View>
        </Space>
      </View>
    </Flex>
  ));
