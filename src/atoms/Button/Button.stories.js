import React from 'react';
import { storiesOf } from '@storybook/react';
import { select } from '@storybook/addon-knobs';

import Flex from '../Flex';
import View from '../View';
import Space from '../Space';
import Button from './Button';

const variants = {
  primary: 'primary',
  secondary: 'secondary',
  tertiary: 'tertiary',
};

const variantColors = {
  primary: 'primary',
  azzure: 'azzure',
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
        <Button
          size={select('Sizes', sizes, 'medium')}
          variant={select('Variants', variants, 'primary')}
          icon="info"
          align="center"
          variantColor={select('VariantColor', variantColors, 'primary')}
        />
        <Button
          size={select('Sizes', sizes, 'medium')}
          variant={select('Variants', variants, 'primary')}
          variantColor={select('VariantColor', variantColors, 'primary')}
        >
          Button
        </Button>
        <Button
          size={select('Sizes', sizes, 'medium')}
          variant={select('Variants', variants, 'primary')}
          icon="info"
          iconAlign={select('iconAlign', iconAlign, 'left')}
          variantColor={select('VariantColor', variantColors, 'primary')}
        >
          Button with Icon
        </Button>
        <Button
          size={select('Sizes', sizes, 'medium')}
          variant={select('Variants', variants, 'primary')}
          icon="info"
          disabled
          iconAlign={select('iconAlign', iconAlign, 'left')}
          variantColor={select('VariantColor', variantColors, 'primary')}
        >
          Disabled Button with Icon
        </Button>
        <Flex flexDirection="row">
          <Space margin={[0.5]} padding={[0.5]}>
            <View>
              <Button
                size={select('Sizes', sizes, 'medium')}
                variant={select('Variants', variants, 'primary')}
                variantColor={select('VariantColor', variantColors, 'primary')}
                block
              >
                Block Button
              </Button>
            </View>
          </Space>
        </Flex>
        <Flex flexDirection="row">
          <Space margin={[0.5]} padding={[0.5]}>
            <View>
              <Button
                size={select('Sizes', sizes, 'medium')}
                variant={select('Variants', variants, 'primary')}
                variantColor={select('VariantColor', variantColors, 'primary')}
                icon="info"
                block
                iconAlign={select('iconAlign', iconAlign, 'left')}
              >
                Block Button
              </Button>
            </View>
          </Space>
        </Flex>
      </View>
    </Flex>
  ));
