import React from 'react';
import { storiesOf } from '@storybook/react';
import Card from './Card';
import Text from '../Text';
import View from '../View';
import Flex from '../Flex';
import { text, select } from '@storybook/addon-knobs';
import { getColorKeys } from '../../_helpers/theme';

const variantOptions = {
  shadowed: 'shadowed',
  outlined: 'outlined',
};

storiesOf('Card', module)
  .addParameters({
    component: Card,
  })
  .add('default', () => (
    <Flex justifyContent="space-evenly" flex={1}>
      <View>
        <Card
          variant={select('Variant', variantOptions, 'shadowed')}
          backgroundColor={select('Background color', getColorKeys(), undefined)}
          borderColor={select('Border color', getColorKeys(), undefined)}
        >
          <Text align="center">
            {text('Display Text', 'The quick brown fox jumps over the lazy dog')}
          </Text>
        </Card>
        <Card
          variant={select('Variant', variantOptions, 'shadowed')}
          backgroundColor={select('Background color', getColorKeys(), undefined)}
          borderColor={select('Border color', getColorKeys(), undefined)}
        >
          <Text align="center">
            {
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi tristique, est sed mollis molestie, ligula ipsum molestie nisl, sit amet consectetur eros mauris non nisi.'
            }
          </Text>
        </Card>
        <Flex alignSelf="flex-start">
          <View>
            <Card
              variant={select('Variant', variantOptions, 'shadowed')}
              backgroundColor={select('Background color', getColorKeys(), undefined)}
              borderColor={select('Border color', getColorKeys(), undefined)}
            >
              <Text align="left">Hello World</Text>
            </Card>
          </View>
        </Flex>
      </View>
    </Flex>
  ));
