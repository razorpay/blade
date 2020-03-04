import React from 'react';
import { storiesOf } from '@storybook/react';
import { select } from '@storybook/addon-knobs';

import Button from './Button';
import Flex from '../Flex';
import View from '../View';

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
    <Flex flex={1} justifyContent="space-around">
      <View>
        <Flex flexDirection="row">
          <View>
            <Button
              size={select('Sizes', sizes, 'medium')}
              variant={select('Variants', variants, 'primary')}
              block
            >
              Block Button
            </Button>
          </View>
        </Flex>
        <Flex flexDirection="row">
          <View>
            <Button
              size={select('Sizes', sizes, 'medium')}
              variant={select('Variants', variants, 'primary')}
              icon="info"
              block
            />
          </View>
        </Flex>
        <Flex flexDirection="row">
          <View>
            <Button
              size={select('Sizes', sizes, 'medium')}
              variant={select('Variants', variants, 'primary')}
              icon="info"
              block
              iconAlign={select('iconAlign', iconAlign, 'left')}
            >
              Block Button
            </Button>
          </View>
        </Flex>
        <Button
          size={select('Sizes', sizes, 'medium')}
          variant={select('Variants', variants, 'primary')}
          icon="info"
          align="center"
        />
        <Button
          size={select('Sizes', sizes, 'medium')}
          variant={select('Variants', variants, 'primary')}
        >
          Button
        </Button>
        <Button
          size={select('Sizes', sizes, 'medium')}
          variant={select('Variants', variants, 'primary')}
          icon="info"
          iconAlign={select('iconAlign', iconAlign, 'left')}
        >
          Button with Icon
        </Button>
        <Button
          size={select('Sizes', sizes, 'medium')}
          variant={select('Variants', variants, 'primary')}
          icon="info"
          disabled
          iconAlign={select('iconAlign', iconAlign, 'left')}
        >
          Disabled Button with Icon
        </Button>
      </View>
    </Flex>
  ));
