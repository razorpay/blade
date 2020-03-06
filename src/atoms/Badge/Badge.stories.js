import React from 'react';
import { storiesOf } from '@storybook/react';
import { select } from '@storybook/addon-knobs';

import Flex from '../Flex';
import View from '../View';
import Badge from './Badge';

const fillOptions = {
  subtle: 'subtle',
  solid: 'solid',
};

const shapeOptions = {
  stadium: 'stadium',
  rectangle: 'rectangle',
};

storiesOf('Badge', module)
  .addParameters({
    component: Badge,
  })
  .add('default', () => (
    <Flex flex={1} justifyContent="space-evenly">
      <View>
        <Badge
          variant="positive"
          fill={select('fill', fillOptions, 'subtle')}
          shape={select('Shape', shapeOptions, 'stadium')}
        >
          Positive
        </Badge>
        <Badge
          variant="negative"
          fill={select('fill', fillOptions, 'subtle')}
          shape={select('Shape', shapeOptions, 'stadium')}
        >
          Negative
        </Badge>
        <Badge
          variant="information"
          fill={select('fill', fillOptions, 'subtle')}
          shape={select('Shape', shapeOptions, 'stadium')}
        >
          Information
        </Badge>
        <Badge
          variant="warning"
          fill={select('fill', fillOptions, 'subtle')}
          shape={select('Shape', shapeOptions, 'stadium')}
        >
          Warning
        </Badge>
        <Badge
          variant="neutral"
          fill={select('fill', fillOptions, 'subtle')}
          shape={select('Shape', shapeOptions, 'stadium')}
        >
          Neutral
        </Badge>
      </View>
    </Flex>
  ));
